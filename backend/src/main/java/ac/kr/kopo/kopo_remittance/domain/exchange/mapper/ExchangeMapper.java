package ac.kr.kopo.kopo_remittance.domain.exchange.mapper;

import ac.kr.kopo.kopo_remittance.domain.exchange.dto.ReservationDTO;
import ac.kr.kopo.kopo_remittance.domain.exchange.dto.TransactionDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Mapper
public interface ExchangeMapper {
    void krwToOther(Map<String, Object> params);
    void otherToKrw(Map<String, Object> params);

    BigDecimal getStandardRate(@Param("currencyCode") String currencyCode);
    String getKRWAccountNumber(@Param("userId") String userId);
    String getForeignCurrencyAccountNumber(@Param("userId") String userId, @Param("currencyCode") String currencyCode);
    void insertTransaction(TransactionDTO transaction);

    void insertReservation(ReservationDTO reservation);
    List<ReservationDTO> getPendingReservations();
    void updateReservationStatus(@Param("reservationId") Long reservationId, @Param("status") String status);
    void expireReservations();

    BigDecimal getSendBuyRate(@Param("currencyCode") String currencyCode);
    BigDecimal getReceiveSellRate(@Param("currencyCode") String currencyCode);

    // 추가된 메서드: 사용자 ID로 이메일 조회
    String getUserEmailById(@Param("userId") String userId);

    // 추가된 메서드: 만료된 예약 조회
    List<ReservationDTO> getExpiredReservations();
}
