# package.json
1. package 초기화
<br>프로젝트를 관리하기 위해서 우선 프로젝트 폴더에서 아래 명령어를 실행한다.
<br>$> npm init
<br>명령어를 실행하면 package.json 파일이 생성된다.

2. 모듈 추가/삭제
<br>내 프로젝트에 모듈을 추가 하고 싶으면 다음과 같이 명령어를 수행하면 된다.
<br>$> npm install {모듈이름} --save
<br>모듈을 추가하면 package.json 파일에 해당 모듈에 대한 dependency가 추가가 된다.
<br>그리고 프로젝트 폴더에 node_modules 폴더가 생기고, 그 아래 해당 모듈이 설치되는 것을 확인할 수 있다.
<br><br>$> npm uninstall {모듈이름} --save
<br>위와 같이 명령어를 실행하면 해당 모듈 의존성을 package.json파일에서 제거하고, 프로젝트 폴더의 node_modules에서도 해당모듈 파일들을 제거한다.

3. 같은 개발환경 설정
<br>이렇게 package.json파일에 내가 사용한 모듈의 의존성이 정의되어 있기 때문에, 나중에 다른 컴퓨터나 다른 폴더에서 내 프로그램을 실행시키기 위해서 node_modules 폴더에 설치된 모든 파일을 옮길 필요가 없다. 
<br>package.json파일과 기본 소스들만 가져온 상태에서 $>npm install 을 실행해주면 내가 사용했던 모듈을 node_modules 폴더에 설치해준다.

4. 스크립트 실행
<br>예를들어 hello.js파일로 작성된 프로그램을 실행하기 위해서는 콘솔에서 $>node hello.js 라고 치면된다.
<br>이러한 shell script를 package.json파일에 script에 정의해놓고 사용할 수도 있다.
<br>예를들어 package.json파일에<pre><code>
"scripts": {
    "start": "node hello.js"
}</code></pre>
위와 같이 입력한 뒤, 콘솔에서 $>npm start라고 입력하면 $>node hello.js를 입력한 것과 같은 효과를 낸다.
