package ac.kr.kopo.kopo_remittance.domain.news;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Value("${naver.client.id}")
    private String naverClientId;

    @Value("${naver.client.secret}")
    private String naverClientSecret;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping
    public ResponseEntity<String> getNews(@RequestBody(required = false) String query) {
        String apiUrl = "https://openapi.naver.com/v1/search/news.json";

        if (query == null || query.isEmpty()) {
            query = "환율";
        }

        RestTemplate restTemplate = new RestTemplate();

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", naverClientId);
        headers.set("X-Naver-Client-Secret", naverClientSecret);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // 쿼리 파라미터 설정
        String urlWithParams = apiUrl + "?query=" + query + "&display=10&sort=date";

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    urlWithParams,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("뉴스 데이터를 가져오는 중 오류 발생");
        }
    }
}
