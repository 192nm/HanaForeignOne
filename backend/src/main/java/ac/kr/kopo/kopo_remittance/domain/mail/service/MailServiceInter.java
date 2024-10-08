package ac.kr.kopo.kopo_remittance.domain.mail.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.UnsupportedEncodingException;

public interface MailServiceInter {

    // 메일 내용 작성
    MimeMessage createMessage(String to, String subject, String content) throws MessagingException, UnsupportedEncodingException;

    // 랜덤 인증코드 생성 (기존)
    String createKey();

    // 인증 메일 발송 (기존)
    String sendSimpleMessage(String to) throws Exception;

    // 일반 메일 발송
    void sendEmail(String to, String subject, String content) throws Exception;
}
