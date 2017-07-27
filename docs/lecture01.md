# 파일 업로드
1. multer 설치<br>
multer : 파일 업로드를 구현하기 위한 모듈<br>
<pre><code>
$ npm install --save multer
</pre></code>

2. upload from WebClient to Server<br>
파일 업로드를 위해서 html의 form, input(type="file")태그를 사용한다.<br>
이때 form태그에 enctype="multipart/form-data" 속성을 설정해 주어야 한다.
