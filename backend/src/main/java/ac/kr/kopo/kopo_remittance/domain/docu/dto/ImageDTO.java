package ac.kr.kopo.kopo_remittance.domain.docu.dto;

import lombok.Data;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import java.sql.Clob;


@Data
public class ImageDTO {
    int docuNo;
    String id;
    byte[] attachedImage;
    String extractedText;
}
