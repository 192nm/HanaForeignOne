package ac.kr.kopo.kopo_remittance.domain.ratio.controller;
import ac.kr.kopo.kopo_remittance.domain.ratio.service.CurrencyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

@RestController
public class CurrencyController {
    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @PostMapping("/updateRatio")
    public String fetchAndSaveRates() {
        try {
            currencyService.fetchAndSaveExchangeRates();
            return "환율 정보가 성공적으로 저장되었습니다.";
        } catch (IOException e) {
            return "환율 정보를 가져오는 데 실패했습니다: " + e.getMessage();
        }
    }



}
