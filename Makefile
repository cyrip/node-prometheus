# Makefile for node-prometheus

# Variables
IMAGE  = cyrip/node-prometheus
TAG = latest

# targets
.PHONY: all

all: build

# Target to run the Ansible playbook
build:
	docker buildx build -t ${IMAGE}:${TAG} .
	docker push ${IMAGE}:${TAG}
