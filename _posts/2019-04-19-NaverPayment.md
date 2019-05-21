---
layout: post
title:  "Naver Payment"
date:   2019-04-19 15:45:00
categories: jekyll
---

#���̹� ���� ����

���̹����� ������ ����Ʈ�� ���̹����� ���� ����� ���� ���� �Ǿ��ִ�.
������ �ش� ���� ������ ���� �ϴµ� �־ ������ �κ��� �ִ�.
����!����!����! ���� ������ ���̹����� ����ڿ� ��ȭ�ϸ鼭 �ذ� �� �κе��
���̹� ���� �����ϴ� ����� ���ؼ� ������ �Ѵ�.

### ����
1. ���̹����� ���� ȯ�� ����
2. ���� ���
  * ���� �帧
  * ���� â ȣ��
  * ���� ���� ��û
  * ���� ��� ��û

##���̹����� ���� ȯ�� ����
* Npay Developers : (https://developer.pay.naver.com)
* ������ ���� ��� : JAVA, JavaScript
* ���� ȯ�� : SpringBoot, Jdk1.7

###���� �帧
![my alternate text](https://developer.pay.naver.com/static/img/v2-payments.png);

###���� â ȣ��
NaverPay javascript SDK �� ������ �� �ֹ����� ������ ��ũ��Ʈ �߰��� ����, 
���̹����� ���� ��ư�� �߰�, ����ȭ�� ���� �� ���� ó���� ���� �� �� �ֵ��� �����մϴ�. 
����ڰ� ���̹��� �α��εǾ� ���� ������ ���̹� �α��� �������� �����ϴ� ��� �� ���̹����� ����Ȯ���� �ʿ��� ����ڵ� ������������ �����ϴ� ����� �����մϴ�.

�����
������ư���� �׷��ִ� Simple Version�� ���� ������ư�� ���� �� �� �ִ� Custom Version�� �����մϴ�.
* Simple Version

{% highlight javascript %}
<!DOCTYPE html>
<html>
<head></head>
<body>
<!--// mode : development or production-->
<!--// data-chain-id : �׷����� ��� chainId�� �־��ּ���-->
<script src="https://nsp.pay.naver.com/sdk/js/naverpay.min.js"
    data-client-id="{#_clientId}"
    data-mode="{#_mode}"
    data-merchant-user-key="{#_merchantUserKey}"
    data-merchant-pay-key="{#_merchantPayKey}"
    data-product-name="{#_productName}"
    data-total-pay-amount="{#_totalPayAmount}"
    data-tax-scope-amount="{#_taxScopeAmount}"
    data-tax-ex-scope-amount="{#_taxExScopeAmount}"
    data-return-url="{#_returnUrl}">
</script>
</body>
</html>
{% endhighlight %}
*Custom Version

{% highlight javascript %}
<!DOCTYPE html>
<html>
<head></head>
<body>
<input type="button" id="naverPayBtn" value="���̹����� ���� ��ư">
<script src="https://nsp.pay.naver.com/sdk/js/naverpay.min.js"></script>
<script>
    var oPay = Naver.Pay.create({ //SDK Parameters�� ���� �ٶ��ϴ�.
          "mode" : "{#_mode}",
          "clientId": "{#_clientId}"
          //"chainId" : "{�׷����� ��� chainId�� �־��ּ���}"
    });

    //���� ����� ���̹����� ������ư�� click Event�� �Ҵ��ϼ���
    var elNaverPayBtn = document.getElementById("naverPayBtn");

    elNaverPayBtn.addEventListener("click", function() {
        oPay.open({ // Pay Reserve Parameters�� ���� �ٶ��ϴ�.
          "merchantUserKey": "{#_merchantUserKey}",
          "merchantPayKey": "{#_merchantPayKey}",
          "productName": "{#_productName}",
          "totalPayAmount": {#_totalPayAmount},
          "taxScopeAmount": {#_taxScopeAmount},
          "taxExScopeAmount": {#_taxExScopeAmount},
          "returnUrl": "{#_returnUrl}"
        });
    });

</script>

</body>
</html>
{% endhighlight %}




