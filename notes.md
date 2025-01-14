# CS 260 Notes

[My startup](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS Notes

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## HTML Notes

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


*Take careful notes about what I have learned"*

## How to use Git

1. Pull the repository's latest changes from GitHub (`git pull`)
2. Make changes to the code
3. Commit the changes (`git commit`)
4. Push the changes to GitHub (`git push`)

### Get in the habit of consistently making a small stable change and then committing.

Verify you have the latest code (git pull)
Refactor, test, and/or implement a small portion of cohesive code (test code test)
Commit and push (git commit git push)
Repeat

## How to use Markdown

https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax


# 2025-01-13
HTML은 Structure
메인 페이지 있어야함. 그래야 그거 보고 grading 한다고 함.
github repo 링크도 포함해야
index.html

Live Server 아주 유용할듯

F12버튼으로 코드 디버깅, kBSA 웹사이트 만들때 했던 것처럼

To deploy an application, .sh파일로 배포 스크립트 작성하여 배포 과정을 자동화

### **전체적인 관계와 배포 흐름**

1. **Key (`k`)**:
    
    서버에 접근하기 위한 인증 정보.
    
    - 역할: 배포하려는 서버와 보안 연결을 생성.
2. **Host (`h`)**:
    
    배포하려는 서버의 위치 정보.
    
    - 역할: 서버에 연결해 작업을 수행.
3. **Service (`s`)**:
    
    배포하려는 애플리케이션 또는 서비스.
    
    - 역할: 배포 후 실행되거나 업데이트될 대상.

css는 html로 만든 structure를 예쁘고 그리고 responsive하게 만들어줌. 근데 css 파일을 만들어서 그 파일들을 html에 가져와서 적용해줘야하는듯..

이거 다음에 자바스크립트하나봄
**WebSocket**은 클라이언트(예: 웹 브라우저)와 서버 간에 **양방향 통신**을 실시간으로 가능하게 해주는 **프로토콜**이에요. 일반적인 HTTP 요청과는 달리, WebSocket은 연결을 유지하면서 **양방향**으로 데이터를 주고받을 수 있습니다.

### **WebSocket의 특징**

1. **양방향 통신 (Full-Duplex)**
    - 클라이언트와 서버가 **동시에** 데이터를 주고받을 수 있습니다.(예: 채팅 애플리케이션에서 서버가 새로운 메시지를 클라이언트에게 바로 전송.)
2. **실시간 데이터 전송**
    - HTTP처럼 매번 요청을 보내고 응답을 기다리는 방식이 아니라, 연결이 유지되면서 데이터를 **즉시** 주고받습니다.
3. **상태 유지 (Persistent Connection)**
    - HTTP는 요청-응답 후 연결이 끊어지지만, WebSocket은 한 번 연결되면 유지됩니다.(예: 게임 애플리케이션이나 주식 시세 업데이트.)
4. **효율성**
    - 연결을 계속 유지하기 때문에 매번 새로운 요청을 생성하는 오버헤드가 줄어듭니다.

https://youtu.be/oVO2VIG0zfI?si=OZWoGfioWG995MmZ&t=204

https://youtu.be/oVO2VIG0zfI?si=-_LLUFiYNnn9F-jv&t=534

WebSocket 어떻게 작성하는지



