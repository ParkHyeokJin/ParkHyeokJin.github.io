---
layout: post
title:  "Naver Payment"
date:   2019-04-19 15:45:00
categories: jekyll
---

#네이버 페이 연동

네이버페이 개발자 사이트에 네이버페이 연동 방법이 상세히 설명 되어있다.
하지만 해당 설명 만으로 연동 하는데 있어서 부족한 부분이 있다.
오류!오류!오류! 잦은 문제로 네이버페이 담당자와 통화하면서 해결 한 부분들과
네이버 페이 연동하는 방법에 대해서 포스팅 한다.

### 목차
1. 네이버페이 개발 환경 정보
2. 연동 방법
  * 결제 흐름
  * 결제 창 호출
  * 결제 승인 요청
  * 결제 취소 요청

##네이버페이 개발 환경 정보
* Npay Developers : (https://developer.pay.naver.com)
* 포스팅 개발 언어 : JAVA, JavaScript
* 개발 환경 : SpringBoot, Jdk1.7

###결제 흐름
![my alternate text](https://developer.pay.naver.com/static/img/v2-payments.png);

###결제 창 호출
NaverPay javascript SDK 는 가맹점 내 주문서에 간단한 스크립트 추가를 통해, 
네이버페이 결제 버튼의 추가, 결제화면 생성 및 노출 처리를 쉽게 할 수 있도록 제공합니다. 
사용자가 네이버에 로그인되어 있지 않으면 네이버 로그인 페이지로 유도하는 기능 및 네이버페이 인증확인이 필요한 사용자도 인증페이지로 유도하는 기능을 제공합니다.

사용방법
결제버튼까지 그려주는 Simple Version과 직접 결제버튼을 만들어서 쓸 수 있는 Custom Version을 제공합니다.
* Simple Version

{% highlight javascript %}
<!DOCTYPE html>
<html>
<head></head>
<body>
<!--// mode : development or production-->
<!--// data-chain-id : 그룹형일 경우 chainId를 넣어주세요-->
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
<input type="button" id="naverPayBtn" value="네이버페이 결제 버튼">
<script src="https://nsp.pay.naver.com/sdk/js/naverpay.min.js"></script>
<script>
    var oPay = Naver.Pay.create({ //SDK Parameters를 참고 바랍니다.
          "mode" : "{#_mode}",
          "clientId": "{#_clientId}"
          //"chainId" : "{그룹형일 경우 chainId를 넣어주세요}"
    });

    //직접 만드신 네이버페이 결제버튼에 click Event를 할당하세요
    var elNaverPayBtn = document.getElementById("naverPayBtn");

    elNaverPayBtn.addEventListener("click", function() {
        oPay.open({ // Pay Reserve Parameters를 참고 바랍니다.
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




