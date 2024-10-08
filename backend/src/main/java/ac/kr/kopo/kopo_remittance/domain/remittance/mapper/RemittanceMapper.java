package ac.kr.kopo.kopo_remittance.domain.remittance.mapper;

import ac.kr.kopo.kopo_remittance.domain.remittance.dto.RemittanceReservationDTO;
import ac.kr.kopo.kopo_remittance.domain.remittance.dto.RemittanceTransactionDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Mapper
public interface RemittanceMapper {

    void sendFx(Map<String, Object> params);

    void sendExchange(Map<String, Object> params);

    // 환율 조회 메서드
    BigDecimal getStandardRate(@Param("currencyCode") String currencyCode);

    // KRW 계좌번호 조회 메서드
    String getKRWAccountNumber(@Param("userId") String userId);

    // 외화 계좌번호 조회 메서드
    String getForeignCurrencyAccountNumber(@Param("userId") String userId, @Param("currencyCode") String currencyCode);

    // 송금 거래 내역 삽입 메서드
    void insertRemittanceTransaction(RemittanceTransactionDTO transaction);

    // 송금 예약 삽입 메서드
    void insertRemittanceReservation(RemittanceReservationDTO reservation);

    // 대기 중인 송금 예약 조회 메서드
    List<RemittanceReservationDTO> getPendingRemittanceReservations();

    // 송금 예약 상태 업데이트 메서드
    void updateRemittanceReservationStatus(@Param("reservationId") Long reservationId, @Param("status") String status);

    // 사용자 ID로 이메일 조회 메서드 추가
    String getUserEmailById(@Param("userId") String userId);
}
