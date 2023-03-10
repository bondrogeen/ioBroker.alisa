![Logo](admin/alisa.png)

# ioBroker.alisa BETA

=================

## Description

It is an adapter to control Yandex devices.

## Install the program and configure the adapter.

<!-- ![Screenshot](admin/img/Picture_for_description.jpg) -->

## Object

**_paw.0.info._** - information about the device  
**_paw.0.devices.[device_id]_** - yandex devices

![Screenshot](admin/img/Screenshot_2.jpg)

## Commands for javascript

```javascript
// [dev1] - is the name of the device, you can also enter IP devices.
// You can specify multiple devices separated by commas 'dev1, dev3, 192.168.1.71'
// all - send to all devices.

sendTo(
	'paw.0',
	'dev1',
	{
		taskerList: 'tasker',
	},
	(res) => {
		log(JSON.stringify(res));
	},
);
```

### 0.0.2

-   (bondrogeen) (adapter) Minor fixes

#### 0.0.1

-   (bondrogeen) initial release

## License

The MIT License (MIT)

Copyright (c) 2022 bondrogeen <bondrogeen@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
