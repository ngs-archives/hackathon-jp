#include <cv.h>
#include <highgui.h>

int
main (int argc, char **argv)
{
	int i;
	IplImage *src_img = 0, *src_gray = 0;
	const char *cascade_name = "haarcascade_frontalface_default.xml";
	CvHaarClassifierCascade *cascade = 0;
	CvMemStorage *storage = 0;
	CvSeq *faces;
	static CvScalar colors[] = {
		{{0, 0, 255}}, {{0, 128, 255}},
		{{0, 255, 255}}, {{0, 255, 0}},
		{{255, 128, 0}}, {{255, 255, 0}},
		{{255, 0, 0}}, {{255, 0, 255}}
	};

	// (1)�������ɤ߹���
	if (argc < 2 || (src_img = cvLoadImage (argv[1], CV_LOAD_IMAGE_COLOR)) == 0)
		return -1;
	src_gray = cvCreateImage (cvGetSize (src_img), IPL_DEPTH_8U, 1);

	// (2)�֡����Ȥ��줿ʬ���Υ��������ɤ��ɤ߹���
	cascade = (CvHaarClassifierCascade *) cvLoad (cascade_name, 0, 0, 0);

	// (3)�������ݤ����ɤ߹���������Υ��졼�������벽���ҥ��ȥ����ζѰ첽��Ԥ�
	storage = cvCreateMemStorage (0);
	cvClearMemStorage (storage);
	cvCvtColor (src_img, src_gray, CV_BGR2GRAY);
	cvEqualizeHist (src_gray, src_gray);

	// (4)ʪ�Ρʴ�˸���
	faces = cvHaarDetectObjects (src_gray, cascade, storage, 1.11, 4, 0, cvSize (40, 40));


	puts("<faces>");
	// (5)���Ф��줿���Ƥδ���֤ˡ��ߤ����褹��
	for (i = 0; i < (faces ? faces->total : 0); i++) {
		puts("  <face>");
		CvRect *r = (CvRect *) cvGetSeqElem (faces, i);
		CvPoint center;
		int radius;
		printf("    <top>%d</top>", r->y);
		printf("    <right>%d</right>", r->x + r->width);
		printf("    <bottom>%d</bottom>", r->y + r->height);
		printf("    <left>%d</left>", r->x);
		center.x = cvRound (r->x + r->width * 0.5);
		center.y = cvRound (r->y + r->height * 0.5);
		radius = cvRound ((r->width + r->height) * 0.25);
		cvCircle (src_img, center, radius, colors[i % 8], 3, 8, 0);
		puts("  </face>");
	}
	puts("</faces>");

	// (6)������ɽ���������������줿�Ȥ��˽�λ
	cvNamedWindow ("Face Detection", CV_WINDOW_AUTOSIZE);
	cvShowImage ("Face Detection", src_img);
	cvWaitKey (0);

	cvDestroyWindow ("Face Detection");
	cvReleaseImage (&src_img);
	cvReleaseImage (&src_gray);
	cvReleaseMemStorage (&storage);

	return 0;
}
