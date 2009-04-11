========
AppScale
========

AppScale
    Google AppEngine アプリケーションを PaaS (Platform-as-a-Service) クラウドで動かすための環境
    http://code.google.com/p/appscale/

Xen 上で AppScale をデプロイする方法。
    http://code.google.com/p/appscale/wiki/Deploying_AppScale_via_Xen

Eucalyptus クラウド上で AppScale をデプロイする方法。
    http://code.google.com/p/appscale/wiki/Deploying_AppScale_via_Eucalyptus

Eucalyptus
----------

Elastic Utility Computing Architecture for Linking Your Programs To Useful Systems
http://eucalyptus.cs.ucsb.edu/

eucalyptus のパッケージ群をダウンロードします::

  $ curl -o eucalyptus-1.4-2.x86_64.rpm http://eucalyptus.cs.ucsb.edu/downloads/63
  $ curl -o eucalyptus-cc-1.4-2.x86_64.rpm http://eucalyptus.cs.ucsb.edu/downloads/64
  $ curl -o eucalyptus-cloud-1.4-2.x86_64.rpm http://eucalyptus.cs.ucsb.edu/downloads/65
  $ curl -o eucalyptus-gl-1.4-2.x86_64.rpm http://eucalyptus.cs.ucsb.edu/downloads/66
  $ curl -o eucalyptus-nc-1.4-2.x86_64.rpm http://eucalyptus.cs.ucsb.edu/downloads/67
  $ curl -o eucalyptus-rpm-deps-x86_64.tar.gz http://eucalyptus.cs.ucsb.edu/downloads/57
  $ tar xfp eucalyptus-rpm-deps-x86_64.tar.gz

インストールする rpm パッケージの依存関係をチェックします::

  $ rpm --test -ivh **/*.rpm
  $ sudo yum install bridge-utils
  ...

jdk をインストールする
~~~~~~~~~~~~~~~~~~~~~~

http://java.sun.com/javase/ja/6/download.html
のページからリンクを辿って Java SE Development Kit (JDK) をダウンロードして
jdk-6u13-linux-i586-rpm.bin という名前のファイルに保存します。

::

    $ chmod +x jdk-6u13-linux-i586-rpm.bin
    $ sudo ./jdk-6u13-linux-i586-rpm.bin
    ...
      1:sun-javadb-common      ########################################### [ 17%]
      2:sun-javadb-core        ########################################### [ 33%]
      3:sun-javadb-client      ########################################### [ 50%]
      4:sun-javadb-demo        ########################################### [ 67%]
      5:sun-javadb-docs        ########################################### [ 83%]
      6:sun-javadb-javadoc     ########################################### [100%]
    ...

