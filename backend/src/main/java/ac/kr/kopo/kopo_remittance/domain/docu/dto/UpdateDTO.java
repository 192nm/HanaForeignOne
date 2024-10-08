package ac.kr.kopo.kopo_remittance.domain.docu.dto;

import lombok.Data;


@Data
public class UpdateDTO {
    private String id;
    private byte[] attachedImage;
}
