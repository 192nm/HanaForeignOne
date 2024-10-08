package ac.kr.kopo.kopo_remittance.domain.mail.service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import ac.kr.kopo.kopo_remittance.domain.exchange.mapper.ExchangeMapper;

@Service
public class RegisterMail implements MailServiceInter {

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private ExchangeMapper exchangeMapper; // 이메일 조회를 위해 ExchangeMapper 주입

    private String ePw;

    // 메일 내용 작성 (일반용)
    @Override
    public MimeMessage createMessage(String to, String subject, String content) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = emailSender.createMimeMessage();
        message.addRecipients(MimeMessage.RecipientType.TO, to);
        message.setSubject(subject);

        message.setText(content, "utf-8", "html");
        message.setFrom(new InternetAddress("ikddt@naver.com", "Fligent_Admin"));

        return message;
    }

    // 인증코드 생성 메서드 유지 (필요 시 사용)
    @Override
    public String createKey() {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();
        String key = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        return key;
    }

    // 인증 메일 발송 (필요 시)
    @Override
    public String sendSimpleMessage(String to) throws Exception {
        // 이 메서드는 인증 메일 발송 용도로 남겨두거나 삭제할 수 있습니다.
        // 새로운 메일 발송 용도로 별도의 메서드를 추가하는 것이 좋습니다.
        return null;
    }

    // 일반 메일 발송 메서드 구현
    @Override
    public void sendEmail(String to, String subject, String content) throws Exception {
        MimeMessage message = createMessage(to, subject, content);
        emailSender.send(message);
    }
}
