from __future__ import print_function
import argparse
import os
import sys
import numpy as np
import cv2
import json
import glob
import random
import torch
import torch.nn as nn
import torch.nn.parallel
import torch.backends.cudnn as cudnn
import torch.optim as optim
import torch.utils.data
import torchvision.datasets as dset
import torchvision.transforms as transforms
import torchvision.utils as vutils
from PIL import Image
from torch.autograd import Variable
from .acgan_network import _netD_result
from .acgan_folder import ImageFolder

ACGAN_IMAGES_PATH = "./titan_sever/acgan/images/"

class Discriminator:
    def __init__(self, detection, model_name, draw_item_type, all_detail, video_idx, item_idx):
        self.model_name = detection+model_name
        self.detection = detection
        self.draw_item_type = draw_item_type
        self.all_detail = json.loads(all_detail)
        self.fk_item_idx = item_idx
        self.fk_video_idx = video_idx

    def imageCrop(self):
        if not os.path.exists(ACGAN_IMAGES_PATH):
            os.mkdir(ACGAN_IMAGES_PATH)
        item_path = ACGAN_IMAGES_PATH+str(self.detection)+"_"+str(self.fk_item_idx)+"_"+str(self.fk_video_idx)+"_"+str(self.draw_item_type)+"/"
        if not os.path.exists(item_path):
            os.mkdir(item_path)
        item_image_path = item_path+"images/"
        if not os.path.exists(item_image_path):
            os.mkdir(item_image_path)
        image_exists = glob.glob(item_image_path+"*.jpg")
        for image in image_exists:
            if os.path.isfile(image):
                return True
        for i in self.all_detail:
            if int(i['draw_item_type']) == int(self.draw_item_type):
                x1 = int(int(i['x'])/(1920/1280))
                y1 = int(int(i['y'])/(1080/720))
                x2 = int(x1+(int(i['width'])/(1920/1280)))
                y2 = int(y1+(int(i['height'])/(1080/720)))
                w = int(int(i['width'])/(1080/720))
                h = int(int(i['height'])/(1080/720))
                img = cv2.imread("../web/app/make_image/" + str(i['fk_video_idx']) + "/images/" + str(i['position']).zfill(5) + ".jpg")
                crop_images = img[y1:y2, x1:x2].copy()
                crop_images = cv2.resize(crop_images, dsize=(w, h), interpolation=cv2.INTER_AREA)
                cv2.imwrite(item_image_path + str(i['position']).zfill(5) + "." + str(i['position_order']) + ".jpg", crop_images)
        return True

    def add_process_ai(self):
        progress = TB_PROCCESS_AI.query.filter_by(fk_video_idx=self.fk_video_idx).first()
        if progress is None:
            new_process = TB_PROCCESS_AI()
            new_process.fk_video_idx = self.video_idx
            new_process.progress = 0
            new_process.draw_img_name = ''
            new_process.draw_img_time = 0
            new_process.ai_status = 0
            db.session.add(new_process)
            db.session.commit()

    def update_process_ai(self, draw_img, current_time, progress_num, ai_status):
        progress = TB_PROCCESS_AI.query.filter_by(fk_video_idx=self.video_idx).first()
        if progress is not None:
            progress.fk_video_idx = self.video_idx
            progress.progress = progress_num
            progress.draw_img_name = draw_img
            progress.draw_img_time = current_time
            progress.ai_status = ai_status
            db.session.commit()

    def delete_process_ai(self):
        delete_ai = TB_PROCCESS_AI.query.filter_by(fk_video_idx=self.fk_video_idx).first()
        if delete_ai is not None:
            db.session.query(TB_PROCCESS_AI).filter_by(fk_video_idx=self.fk_video_idx).delete()
            db.session.commit()

    def discriminator_func(self):
        paths = []
        predict_name = []
        orders = []
        ngpu = 1
        nz = 110
        ngf = 64
        ndf = 64
        batchSize = 52
        # batch: 104로 변경
        imageSize = 128
        num_classes = 13
        nc = 3

        def f2(x):
            return x[1]

        classes_name = ['여성 WL 스트레치 슬릿 큐롯', '여성 컨피던스 블럭', '여성 컨피던스 플리츠 큐롯', '남성 CF 간절 멜란지 팬츠', '와이드앵글 남성 WL 뱀부 향균 팬츠', '여성 슈퍼 스트레치 베이직 팬츠', 'pink', 'RWPCI5531', '블랙 삼선뒷밴딩 여성골프 스커트', '여성 웰딩 포인트 큐롯', 'RWPCJ7511-500_G', 'WWU18Q31W3', 'WWM19Q02Z1']

        os.environ['CUDA_VISIBLE_DEVICES'] = str(0)
        cudnn.benchmark = True

        dataset = ImageFolder(
            root="./titan_sever/acgan/images/"+self.detection+"_"+self.fk_item_idx+"_"+self.fk_video_idx+"_"+self.draw_item_type,
            transform=transforms.Compose([
                transforms.Resize(imageSize),
                transforms.CenterCrop(imageSize),
                transforms.ToTensor(),
                transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
            ]),
            classes_idx=(int(num_classes), 20))
        dataloader = torch.utils.data.DataLoader(dataset, batch_size=batchSize,
                                                 shuffle=False, num_workers=int(2))

        model_path = "./titan_sever/acgan/"+str(self.detection)+"model"
        if not os.path.exists(model_path):
            os.mkdir(model_path)
        image_len = len(dataset)
        device = torch.device('cpu')
        netD = _netD_result(1, num_classes)
        # GPU
        # netD.load_state_dict(torch.load("./titan_sever/acgan/"+str(self.model_name)))
        netD.load_state_dict(torch.load("./titan_sever/acgan/"+str(self.model_name), map_location=device))

        input = torch.FloatTensor(batchSize, 3, imageSize, imageSize)
        noise = torch.FloatTensor(batchSize, nz, 1, 1)
        eval_noise = torch.FloatTensor(batchSize, nz, 1, 1).normal_(0, 1)
        dis_label = torch.FloatTensor(batchSize)
        aux_label = torch.LongTensor(batchSize)
        real_label = 1
        fake_label = 0

        # GPU
        # netD.cuda()
        # dis_criterion.cuda()
        # aux_criterion.cuda()
        # input, dis_label, aux_label = input.cuda(), dis_label.cuda(), aux_label.cuda()
        # noise, eval_noise = noise.cuda(), eval_noise.cuda()

        input = Variable(input)
        noise = Variable(noise)
        eval_noise = Variable(eval_noise)
        dis_label = Variable(dis_label)
        aux_label = Variable(aux_label)

        eval_noise_ = np.random.normal(0, 1, (batchSize, nz))
        eval_label = np.random.randint(0, num_classes, batchSize)
        eval_onehot = np.zeros((batchSize, num_classes))
        eval_onehot[np.arange(batchSize), eval_label] = 1
        eval_noise_[np.arange(batchSize), :num_classes] = eval_onehot[np.arange(batchSize)]
        eval_noise_ = (torch.from_numpy(eval_noise_))
        eval_noise.data.copy_(eval_noise_.view(batchSize, nz, 1, 1))

        predict_class = []
        predict_cnt = dict()

        for i, data in enumerate(dataloader, 0):
            netD.eval()
            netD.zero_grad()
            images, labels, path = data
            paths += data[2]
            batch_size = images.size(0)
            # images = images.cuda()
            # labels = labels.cuda()
            with torch.no_grad():
                input.resize_as_(images).copy_(images)
                dis_label.resize_(batch_size).fill_(real_label)
                aux_label.resize_(batch_size).copy_(labels)
            dis, aux = netD(input)
            _, pred = torch.max(aux.data, 1)
            predict = (i for i in pred)
            for i in predict:
                position = data[2].split('\\')[len(data[2].split('\\')) - 1]
                position_name = int(position.split(".")[0])
                order = int(position.split(".")[1])
                update_detail = TB_ITEM_DETAIL.query.filter_by(fk_item_idx=self.fk_item_idx, position=position_name,
                                                               position_order=order, fk_video_idx=self.fk_video_idx,
                                                               draw_item_type=self.draw_item_type).first()
                update_detail.classification_item = classes_name[int(i)]
                db.session.add(update_detail)
                db.session.commit()
                predict_class.append(classes_name[i]+str(image_len)+"\n")
                if classes_name[int(i)] not in predict_cnt.keys():
                    predict_cnt[classes_name[int(i)]] = 1
                else:
                    predict_cnt[classes_name[int(i)]] += 1

        sort_predict_cnt = sorted(predict_cnt.items(), key=(lambda x:x[1]), reverse=True)

        with open("dis_cnt_bottom.txt", 'a') as f:
            f.writelines(str(sort_predict_cnt)+str(image_len))
            f.writelines("\n")

        return paths, predict_name, self.fk_item_idx, self.fk_video_idx