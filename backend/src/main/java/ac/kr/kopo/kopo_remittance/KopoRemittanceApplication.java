package ac.kr.kopo.kopo_remittance;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class KopoRemittanceApplication {

	public static void main(String[] args) {
		SpringApplication.run(KopoRemittanceApplication.class, args);
	}

}
