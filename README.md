# Ts22.ir front end
SPG Teamspeak server website
Copyright (C) 2021 Arian Rezazadeh
[![Image of website](https://beeimg.com/images/i66636727661.png)](https://beeimg.com/view/i66636727661)

## How to run
First install requirements using yarn:
```
yarn install
```
then start it:
```
yarn start
```

## Testing rest API
There is python script under 'api' folder than send static api result, You can install script requirements using:
```
pip install -r requirements.txt
```
and run it:
```
python test-api.py
```
at end just change api url in `src/constants.tsx` to your localhost and selected port and you are done.