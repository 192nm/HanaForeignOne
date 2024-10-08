package ac.kr.kopo.kopo_remittance.domain.mail.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ac.kr.kopo.kopo_remittance.domain.mail.service.RegisterMail;

@RestController
@RequestMapping(value = "/api/mail")
public class MailServiceRestController {

    @Autowired
    RegisterMail registerMail;

    //127.0.0.1:8080/ROOT/api/mail/confirm.json?email
    @GetMapping(value = "/confirm.json")
    public String mailConfirm(@RequestParam(name = "email") String email) throws Exception{
        String code = registerMail.sendSimpleMessage(email);
        System.out.println("사용자에게 발송한 인증코드 ==> " + code);

        return code;
    }

}