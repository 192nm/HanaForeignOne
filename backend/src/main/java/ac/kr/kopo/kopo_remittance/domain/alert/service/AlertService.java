package ac.kr.kopo.kopo_remittance.domain.alert.service;

import ac.kr.kopo.kopo_remittance.domain.alert.dto.AlertDTO;
import ac.kr.kopo.kopo_remittance.domain.alert.mapper.AlertMapper;
import ac.kr.kopo.kopo_remittance.domain.mail.service.MailServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertMapper alertMapper;

    @Autowired
    private MailServiceInter mailService;

    // 알림 저장 메서드
    public void saveAlert(AlertDTO alertDTO) {
        alertMapper.insertAlert(alertDTO);
    }

    // 스케줄러: 일정 시간마다 실행되어 알림 조건을 확인하고 이메일 발송
    @Scheduled(fixedRate = 60000) // 1분마다 실행
    public void checkAlerts() {
        List<AlertDTO> alerts = alertMapper.getAllAlerts();
        for (AlertDTO alert : alerts) {
            BigDecimal currentRate = alertMapper.getCurrentExchangeRate(alert.getCurrencyCode());

            // 환율 조건 확인
            boolean conditionMet = false;
            if ("higher".equals(alert.getAlertCondition())) {
                if (currentRate.compareTo(alert.getTargetRate()) >= 0) {
                    conditionMet = true;
                }
            } else if ("lower".equals(alert.getAlertCondition())) {
                if (currentRate.compareTo(alert.getTargetRate()) <= 0) {
                    conditionMet = true;
                }
            }

            if (conditionMet) {
                // 이메일 발송
                String email = alertMapper.getUserEmailById(alert.getUserId());
                if (email != null && !email.isEmpty()) {
                    try {
                        String subject = "환율 알림: 목표 환율에 도달했습니다.";
                        String content = "설정하신 환율에 도달했습니다.\n현재 환율: " + currentRate + "원";

                        mailService.sendEmail(email, subject, content);

                        // 알림 삭제
                        alertMapper.deleteAlert(alert.getAlertId());

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
