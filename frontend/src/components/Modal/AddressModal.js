import React, { useEffect } from 'react';

const AddressModal = ({ onClose, onSelectAddress }) => {

  // useEffect(() => {
  //   new window.daum.Postcode({
  //     oncomplete: function(data) {
  //       // 주소 선택 시 호출되는 콜백
  //       onSelectAddress(data.address);
  //       onClose();
  //     },
  //     onclose: function() {
  //       onClose();
  //     }
  //   }).open();
  // }, [onClose, onSelectAddress]);

  useEffect(() => {
    console.log("호출됨");
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 주소 선택 시 호출되는 콜백
        onSelectAddress(data.address);
        onClose();
      },
      onclose: function() {
        onClose();
      }
    }).open();
  }, []);


  return (
    // <div className="modal-backdrop">
    //   <div className="modal-content">
    //     <div id="daum-postcode"></div>
    //     <button className="close-button" onClick={onClose}>닫기</button>
    //   </div>
    // </div>
    <></>
  );
};

export default AddressModal;
