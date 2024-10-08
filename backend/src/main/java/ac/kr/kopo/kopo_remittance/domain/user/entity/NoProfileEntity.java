package ac.kr.kopo.kopo_remittance.domain.user.entity;


import lombok.Data;

@Data
public class NoProfileEntity {
    private int userNo;
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String email;
    private String engName;
    private String identifyNo;
    private String address;
}
