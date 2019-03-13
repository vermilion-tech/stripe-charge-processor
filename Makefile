REPO=vermilion-tech/stripe-charge-processor
TAG:=$(shell git describe --always)

build:
	docker build -t ${REPO} .
	docker tag ${REPO}:latest ${REPO}:${TAG}

run:
	docker run --rm -it ${REPO}
