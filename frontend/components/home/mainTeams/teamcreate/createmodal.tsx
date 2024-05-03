import Swal from "sweetalert2";

export default async function TeamCreate() {
    const defaultImageUrl = "path/to/default-profile.jpg"; // 기본 이미지 경로 설정
    const { value: formValues } = await Swal.fire({
      title: '팀 생성하기',
      html: `
        <style>
          .swal2-input {
            width: 80%;
            margin-bottom: 12px;
          }
          .swal2-html-container {
            text-align: center;
          }
          .file-input {
            visibility: hidden;
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
          }
          .file-input-label {
            display: inline-block;
            background: #ffc107;
            color: black;
            padding: 6px 12px;
            text-align: center;
            border-radius: 25px;
            cursor: pointer;
            margin-right: 10px;
            vertical-align: middle;
          }
          .file-name, .image-preview {
            display: inline-block;
            font-size: 16px;
            color: #555;
            vertical-align: middle;
            margin-left: 10px;
          }
          .image-preview {
            max-height: 50px;
            display: none;
          }
        </style>
        <input id="swal-input1" class="swal2-input" type="text" placeholder="팀 이름을 입력하세요" required>
        <input id="swal-input2" class="swal2-input" type="text" placeholder="곡명을 입력하세요">
        <input id="swal-input3" class="file-input" type="file" accept="image/*">
        <label for="swal-input3" class="file-input-label">프로필 사진 선택</label>
        <img id="image-preview" class="image-preview" src="" alt="이미지 미리보기">
        <span id="file-name" class="file-name">선택된 파일 없음</span>
        <div style="font-size: 12px; color: #555; margin-top: 8px;">프로필 이미지는 JPG 혹은 PNG 파일만 등록 가능합니다.</div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '생성하기',
      cancelButtonText: '취소하기',
      preConfirm: () => {
        const input1 = document.getElementById('swal-input1') as HTMLInputElement;
        const input2 = document.getElementById('swal-input2') as HTMLInputElement;
        const input3 = document.getElementById('swal-input3') as HTMLInputElement;
        const file = input3.files && input3.files.length > 0 ? input3.files[0] : null;
  
        if (!input1.value) {
          Swal.showValidationMessage('팀 이름은 필수값입니다.');
          return false;
        }
  
        return [input1.value, input2.value, file || defaultImageUrl];
      },
      didOpen: () => {
        const inputElement = document.getElementById('swal-input3') as HTMLInputElement;
        const fileNameDisplay = document.getElementById('file-name') as HTMLSpanElement;
        const imgPreview = document.getElementById('image-preview') as HTMLImageElement;
  
        inputElement.addEventListener('change', () => {
          if (inputElement.files && inputElement.files.length > 0) {
            const file = inputElement.files[0];
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
              if (e.target && e.target.result) {
                imgPreview.src = e.target.result as string;
                imgPreview.style.display = 'inline-block';
              }
            };
            reader.readAsDataURL(file);
            fileNameDisplay.textContent = file.name;
          } else {
            fileNameDisplay.textContent = '선택된 파일 없음';
            imgPreview.src = defaultImageUrl; // 기본 이미지 표시
            imgPreview.style.display = 'inline-block';
          }
        });
      }
    });
  
    if (formValues) {
      Swal.fire({
        title: `${formValues[0]} 팀이 생성되었습니다!`,
        icon: 'success',
        confirmButtonText: '확인'
      });
    }
  };