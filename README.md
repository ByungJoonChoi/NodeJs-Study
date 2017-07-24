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

# Express
1. Express란? NodeJs 웹 어플리케이션 프레임워크
<br>Express모듈을 추가하여 개발하면, 쉽고 빠르게 웹 어플리케이션을 구현할 수 있다.

2. 라우터
<br>라우터를 이용하면 사용자 요청을 쉽게 파싱하여 해당 요청 컨트롤러에 연결해줄 수 있다.<pre><code>
app.get('/', (req, res) => {
  res.send('Welcome!!!');
});
app.get('/login', (req, res) =>{
  res.send('Please, Login!!');
});
</code></pre>위와 같이 작성하면, localhost:3000/ 요청에 'Welcome!!!'을 응답하고,
<br>localhost:3000/login 요청에 'Please, Login!!'을 응답한다.
<br>post방식의 요청을 파싱하기 위해서는 app.post({path}, {function}) 형태로 작성하면 된다.

3. 정적파일 서비스
<br>정적인 파일을 서비스하기 위해서는 아래와 같이 폴더를 지정해주고, 해당 폴더에 정적 파일들을 넣어두면 된다.<pre><code>
app.use(express.static('public'));
</code></pre>
<br>위와 같이 설정해둔 상태에서 public폴더에 'totoro.jpg'파일을 저장해두면,
<br>웹브라우져에서 localhost:3000/totoro.jpg 로 해당 파일에 접근할 수 있다.
<br><br>express.static()의 인자로 들어가는 경로는 node 프로세스가 실행되는 디렉토리에 대해 상대적이기 때문에
<br>절대경로로 설정해주는 것이 좀 더 안전하다.
<br>아래와 같이 설정하자.<pre><code>
app.use(express.static(__dirname + '/public'));
</code></pre>

4. 템플릿 엔진
<br>템플릿 엔진을 사용하면 동적 웹페이지를 쉽게 작성할 수 있다.
<br>Express에서 default로 사용하는 템플릿 엔진은 pug이다.(예전에 'jade'였는데 이름이 바뀜)
<br><br>1) 설치
<br>$ npm install pug --save
<br><br>2) 설정<pre><code>
app.set('view engine', 'pug');
app.set('views', './views');</code></pre>
첫째 줄은 템플릿 엔진으로 pug를 사용하겠다는 뜻.<br>
두번째 줄은 템플릿 엔진 파일(.pug)을 ./views 폴더에 저장해 두겠다는 뜻.<br>
두번째 줄은 생략 가능하며, 생략 시 view들의 폴더로 ./views 가 default로 설정됨.<br>
(express.static으로 폴더 설정하는 것과 비슷하게, 별도의 경로지정 없이 ./views에 저장된 파일 인식)
<br><br>3) 사용<pre><code>
app.get('/template', (req, res) => {
  res.render('temp', {time: new Date().toLocaleString(), _title: "pug"});
});</code></pre>
템플릿엔진으로 작성된 html파일로 사용자 요청에 응답하려면 res.render() 메소드 호출<br>
첫번째 인자('temp')는 ./views 폴더에 저장된 temp.pug 파일로, 확장자를 생략<br>
두번째 인자로 json을 보낼 수 있으며, 해당 템플릿 엔진 파일에서 변수로 사용 가능.
<br><br>4) 예제코드<pre><code>
html
  head
    title= _title
  body
    h1 Hello Pug!!
    ul
      -for(var i=0; i<5; i++)
        li coding
    div= time
</code></pre>
json 객체의 key로 값을 전달할 수 있으며, '-'를 사용하여 javascript로직 추가 가능

5. 쿼리스트링<br>
localhost:3000/topic?id=0 와 같은 url이 있을 때, ?id=0 부분을 쿼리스트링이라고 한다.<br>
쿼리스트링에 의해 전달된 parameter(id)는 req.query 객체로부터 가져올 수 있다.(let id = req.query.id)<br>



# Array Sorting
1. 기본 sorting 예제<pre><code>
a = [6,1,4,5,2,3]; a.sort();
</code></pre>결과 : [ 1, 2, 3, 4, 5, 6 ]
<br> Array.sort() 는 기본적으로 오름차순 정렬

2. 익명함수 이용하여 내림차순 정렬해보기<pre><code>
a = [6,1,4,5,2,3]; a.sort(function(a,b){return b-a});
</code></pre>결과 : [ 6, 5, 4, 3, 2, 1 ]

3. 람다식 이용하여 내림차순 정렬해보기<pre><code>
a = [6,1,4,5,2,3]; a.sort((a,b) => (b-a));
</code></pre>결과 : [ 6, 5, 4, 3, 2, 1 ]
