package ac.kr.kopo.kopo_remittance.domain.expect.service;

import ac.kr.kopo.kopo_remittance.domain.expect.dto.RequestAdviceDTO;
import ac.kr.kopo.kopo_remittance.domain.expect.dto.PredictRequestDTO;
import ac.kr.kopo.kopo_remittance.domain.expect.dto.PredictResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdviceService {

    private final String PREDICT_URL = "http://127.0.0.1:5000/predict";

    public List<String> processAdvice(RequestAdviceDTO requestAdviceDTO) {
        List<String> matchingDates = new ArrayList<>();
        RestTemplate restTemplate = new RestTemplate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate startDate = LocalDate.parse(requestAdviceDTO.getDate(), formatter);
        BigDecimal targetRatio = requestAdviceDTO.getTargetRatio();

        for (int i = 0; i < 30; i++) {
            LocalDate currentDate = startDate.plusDays(i);
            PredictRequestDTO predictRequestDTO = new PredictRequestDTO(requestAdviceDTO.getCurrency(), currentDate.format(formatter));

            // API 호출
            PredictResponseDTO response = restTemplate.postForObject(PREDICT_URL, predictRequestDTO, PredictResponseDTO.class);

            // 응답 값 체크
            if (response != null && response.getPredictedExchangeRate() != null) {
                // predictedExchangeRate가 targetRatio보다 큰지 비교
                if (response.getPredictedExchangeRate().compareTo(targetRatio) < 0) {
                    matchingDates.add(response.getDate());
                }
            } else {
                System.out.println("예측 응답이 null 이거나, predictedExchangeRate가 없습니다: " + predictRequestDTO);
            }
        }

        return matchingDates;
    }
}
