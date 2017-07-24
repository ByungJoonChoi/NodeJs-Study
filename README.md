# package.json
1. package 초기화
<br>프로젝트를 관리하기 위해서 우선 프로젝트 폴더에서 아래 명령어를 실행한다.
<br>$> npm init
<br>명령어를 실행하면 package.json 파일이 생성된다.

2. 모듈 추가
<br>내 프로젝트에 모듈을 추가 하고 싶으면 다음과 같이 명령어를 수행하면 된다.
<br>$> npm install {모듈이름} --save
<br>모듈을 추가하면 package.json 파일에 해당 모듈에 대한 dependency가 추가가 된다.
<br>그리고 프로젝트 폴더에 node_modules 폴더가 생기고, 그 아래 해당 모듈이 설치되는 것을 확인할 수 있다.
<br><br>이렇게 package.json파일에 내가 사용한 모듈의 의존성이 정의되어 있기 때문에, 나중에 다른 컴퓨터나 다른 폴더에서 내 프로그램을 실행시키기 위해서 node_modules 폴더에 설치된 모든 파일을 옮길 필요가 없다. 
<br>package.json파일과 기본 소스들만 가져온 상태에서 $>npm install 을 실행해주면 내가 사용했던 모듈을 node_modules 폴더에 설치해준다.
