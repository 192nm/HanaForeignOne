package ac.kr.kopo.kopo_remittance.domain.exchange.controller;

import ac.kr.kopo.kopo_remittance.domain.exchange.dto.ExchangeReservationRequestDTO;
import ac.kr.kopo.kopo_remittance.domain.exchange.dto.KrwToOtherDTO;
import ac.kr.kopo.kopo_remittance.domain.exchange.dto.OtherToKrwDTO;
import ac.kr.kopo.kopo_remittance.domain.exchange.service.ExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class ExchangeController {

    @Autowired
    private ExchangeService exchangeService;

    @PostMapping("/krwToOther")
    public String krwToOther(@RequestBody KrwToOtherDTO request) {

        try {
            exchangeService.krwToOther(
                    request.getUserId(),
                    request.getAmount(),
                    request.getCurrencyCode());
            return "환전이 성공적으로 완료되었습니다.";
        } catch (Exception e) {
            return "환전 실패: " + e.getMessage();
        }
    }

    @PostMapping("/otherToKrw")
    public String otherToKrw(@RequestBody OtherToKrwDTO request) {

        try {
            exchangeService.otherToKrw(
                    request.getUserId(),
                    request.getAmount(),
                    request.getCurrencyCode());
            return "환전이 성공적으로 완료되었습니다.";
        } catch (Exception e) {
            return "환전 실패: " + e.getMessage();
        }
    }

    @PostMapping("/reserveExchange")
    public String reserveExchange(@RequestBody ExchangeReservationRequestDTO request) {
        try {
            exchangeService.reserveExchange(request);
            return "환전 예약이 성공적으로 등록되었습니다.";
        } catch (Exception e) {
            return "환전 예약 실패: " + e.getMessage();
        }
    }
}
