CPPFLAGS=-I/opt/local/include/opencv -I/usr/include/opencv
LDFLAGS=-L/opt/local/lib -lcxcore -lhighgui -lcv
all:	haar_detect
run:
	./haar_detect face.jpg
cui:
	./haar_detect face.jpg --no-gui
clean:
	rm haar_detect
