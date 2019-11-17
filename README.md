# post
warning: LF will be replaced by CRLF in post01/app.js.
The file will have its original line endings in your working directory
  위와 같은 에러는 cmd 창에 다음과 같은 순서로 하면 된다.
  
 
  git config --global core.autocrlf true
  git add -A
  git commit -m "---"
  git push -u origin master
  
