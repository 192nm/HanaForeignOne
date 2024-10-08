package ac.kr.kopo.kopo_remittance.domain.ratio.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class CurrencyService {



    private final JdbcTemplate jdbcTemplate;

    public CurrencyService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 환율 정보 크롤링 후 데이터베이스에 저장하는 메서드
    public void fetchAndSaveExchangeRates() throws IOException {
        String url = "https://finance.naver.com/marketindex/exchangeList.naver";
        Document doc = Jsoup.connect(url).get();
        Elements rows = doc.select("table.tbl_exchange tbody tr");

        for (Element row : rows) {
            Elements columns = row.select("td");

            if (columns.size() >= 7) {
                String currencyName = columns.get(0).text().trim();  // 통화 이름
                String currencyCode = getCurrencyCode(currencyName);  // 통화 코드 추출
                String standardRateStr = columns.get(1).text().trim().replace(",", "");  // 매매기준율
                String cashBuyRateStr = columns.get(2).text().trim().replace(",", "");   // 현찰 사실 때
                String cashSellRateStr = columns.get(3).text().trim().replace(",", "");  // 현찰 파실 때
                String sendBuyRateStr = columns.get(4).text().trim().replace(",", "");   // 송금 보낼 때
                String receiveSellRateStr = columns.get(5).text().trim().replace(",", ""); // 송금 받으실 때
                String spreadStr = columns.get(6).text().trim().replace(",", "");        // 미화 환산율 (팔 때)

                double standardRate = parseDouble(standardRateStr);
                double cashBuyRate = parseDouble(cashBuyRateStr);
                double cashSellRate = parseDouble(cashSellRateStr);
                double sendBuyRate = parseDouble(sendBuyRateStr);
                double receiveSellRate = parseDouble(receiveSellRateStr);
                double spread = parseDouble(spreadStr);

                // 모든 통화에 대해 데이터베이스에 저장
                if (!currencyCode.isEmpty()) {
                    saveOrUpdateExchangeRate(currencyCode, currencyName, standardRate, cashBuyRate, cashSellRate, sendBuyRate, receiveSellRate, spread, spread);
                }
            }
        }
    }

    // 통화 이름에서 통화 코드를 추출하는 메서드
    private String getCurrencyCode(String currencyName) {
        if (currencyName.contains("JPY")) {
            return "JPY";  // 일본 엔화는 "JPY"로 고정
        }
        if (currencyName.length() >= 3) {
            return currencyName.substring(currencyName.length() - 3).toUpperCase();  // 통화 이름에서 마지막 세 글자를 통화 코드로 사용
        }
        return currencyName;  // 통화 코드가 없을 경우 통화 이름 전체 반환
    }

    // 문자열을 double로 변환하는 메서드 (N/A인 경우 0으로 처리)
    private double parseDouble(String value) {
        if (value.equals("N/A")) {
            return 0.0;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    // 데이터베이스에 환율 정보를 저장 또는 업데이트하는 메서드
    private void saveOrUpdateExchangeRate(String currencyCode, String currencyName, double standardRate, double cashBuyRate, double cashSellRate,
                                          double sendBuyRate, double receiveSellRate, double buySpread, double sellSpread) {
        String selectSql = "SELECT COUNT(*) FROM EXCHANGERATE WHERE CURRENCY_CODE = ?";
        int count = jdbcTemplate.queryForObject(selectSql, Integer.class, currencyCode);

        if (count == 0) {
            // 데이터가 없으면 INSERT
            String insertSql = "INSERT INTO EXCHANGERATE (CURRENCY_CODE, CURRENCY_NAME, STANDARD_RATE, CASH_BUY_RATE, CASH_SELL_RATE, " +
                    "SEND_BUY_RATE, RECEIVE_SELL_RATE, BUY_SPREAD, SELL_SPREAD) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, currencyCode, currencyName, standardRate, cashBuyRate, cashSellRate, sendBuyRate, receiveSellRate, buySpread, sellSpread);
        } else {
            // 데이터가 있으면 UPDATE
            String updateSql = "UPDATE EXCHANGERATE SET CURRENCY_NAME = ?, STANDARD_RATE = ?, CASH_BUY_RATE = ?, CASH_SELL_RATE = ?, " +
                    "SEND_BUY_RATE = ?, RECEIVE_SELL_RATE = ?, BUY_SPREAD = ?, SELL_SPREAD = ? WHERE CURRENCY_CODE = ?";
            jdbcTemplate.update(updateSql, currencyName, standardRate, cashBuyRate, cashSellRate, sendBuyRate, receiveSellRate, buySpread, sellSpread, currencyCode);
        }
    }


}
