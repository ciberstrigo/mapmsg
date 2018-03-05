#Automatic mail composing system. 

A small simple utility, created in the interests of Private Security Company "MAP BEZOPASNOST'" to alert employees about changes in work.

###CLI parameters:

  -c, --config FILE      Configuration file. Only JSON.  
  -r, --recipient FILE   File with recipient and other data. Only CSV.  
  -t, --text FILE        Message text. TXT file plz.  
  -h, --help             Display help and usage details   


###Description

This utility is both a tool for mass mail sending, and the simplest template engine.
All variables are stored in the .CSV file.
Required parameters:  
1. email address of the recipient  
2. subject - the subject of the letter.  

All other parameters are added as needed and used in the text through the symbol **$** + the name of the variable.

###Example.

Text written like:

>The quick brown **$animal1** jumps over the lazy **$animal2**

With CSV table like:

| email         | subject                      | animal1  | animal2         |
| ------------- | ---------------------------- | -------- | --------------- |
| aaa@bbb.com   | A short story about animals. |   fox    | dog             |
| bbb@ccc.com   | A short story about animals. |   cat    | horse           |
| ccc@ddd.com   | A short story about animals. |   bear   | cow             |

Will be converted into three different email messages:

>The quick brown **fox** jumps over the lazy **dog**

will be sended to **aaa@bbb.com**;

>The quick brown **cat** jumps over the lazy **horse**

will be sended to **bbb@ccc.com**;

>The quick brown **bear** jumps over the lazy **cow**

will be sended to **ccc@ddd.com**;


