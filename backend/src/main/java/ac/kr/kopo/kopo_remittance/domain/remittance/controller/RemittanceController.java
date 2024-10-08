package ac.kr.kopo.kopo_remittance.domain.remittance.controller;

import ac.kr.kopo.kopo_remittance.domain.remittance.dto.RemittanceReservationDTO;
import ac.kr.kopo.kopo_remittance.domain.remittance.dto.SendExchangeDTO;
import ac.kr.kopo.kopo_remittance.domain.remittance.dto.SendFxDTO;
import ac.kr.kopo.kopo_remittance.domain.remittance.service.RemittanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class RemittanceController {

    @Autowired
    private RemittanceService remittanceService;

    /**
     * 외화를 바로 송금하는 엔드포인트
     * @param sendFxDTO 송금 요청 데이터
     * @return 성공 메시지 또는 에러 메시지
     */
    @PostMapping("/sendFx")
    public ResponseEntity<String> sendFx(@RequestBody SendFxDTO sendFxDTO) {
        try {
            remittanceService.sendFx(sendFxDTO);
            return ResponseEntity.ok("외화 송금이 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("외화 송금 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 원화를 환전 후 송금하는 엔드포인트
     * @param sendExchangeDTO 송금 및 환전 요청 데이터
     * @return 성공 메시지 또는 에러 메시지
     */
    @PostMapping("/sendExchange")
    public ResponseEntity<String> sendExchange(@RequestBody SendExchangeDTO sendExchangeDTO) {
        try {
            remittanceService.sendExchange(sendExchangeDTO);
            return ResponseEntity.ok("환전 및 송금이 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("환전 및 송금 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 송금 예약을 등록하는 엔드포인트
     * @param reservationDTO 송금 예약 데이터
     * @return 성공 메시지 또는 에러 메시지
     */
    @PostMapping("/reserveRemittance")
    public ResponseEntity<String> reserveRemittance(@RequestBody RemittanceReservationDTO reservationDTO) {
        try {
            remittanceService.reserveRemittance(reservationDTO);
            return ResponseEntity.ok("송금 예약이 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("송금 예약 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
