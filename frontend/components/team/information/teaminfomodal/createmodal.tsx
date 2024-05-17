'use client';

import Swal from 'sweetalert2';
import { postCreateTeam } from '@/services/team';

export default async function TeamCreate() {
  const defaultImageUrl = '';
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
        <input id="swal-input1" class="swal2-input" type="text" placeholder="팀 이름 (최대 30자)" maxlength="30" required>
        <input id="swal-input2" class="swal2-input" type="text" placeholder="곡명 (최대 40자)" maxlength="40">
        <input id="swal-input3" class="file-input" type="file" accept="image/*">
        <label for="swal-input3" class="file-input-label">프로필 사진 선택</label>
        <img id="image-preview" class="image-preview" src="" alt="이미지 미리보기">
        <span id="file-name" class="file-name">선택된 파일 없음</span>
        <div style="font-size: 12px; color: #555; margin-top: 8px;">프로필 이미지는 JPG, JPEG, PNG 파일만 등록 가능합니다.</div>
      `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: '생성하기',
    cancelButtonText: '취소하기',
    preConfirm: () => {
      const input1 = document.getElementById('swal-input1') as HTMLInputElement;
      const input2 = document.getElementById('swal-input2') as HTMLInputElement;
      const input3 = document.getElementById('swal-input3') as HTMLInputElement;
      const file =
        input3.files && input3.files.length > 0 ? input3.files[0] : null;

      if (!input1.value) {
        Swal.showValidationMessage('팀 이름은 필수값입니다.');
        return false;
      }

      if (input1.value.length > 30) {
        Swal.showValidationMessage('팀 이름은 최대 30자까지 입력 가능합니다.');
        return false;
      }

      if (input1.value.length > 40) {
        Swal.showValidationMessage('곡명은 최대 40자까지 입력 가능합니다.');
        return false;
      }

      if (file) {
        const fileName = file.name.toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

        if (!validExtensions.includes(fileExtension)) {
          Swal.showValidationMessage('잘못된 파일 형식입니다.');
          return false;
        }
      }

      Swal.resetValidationMessage(); // 파일 형식이 유효하면 경고 메시지 제거
      return [input1.value, input2.value, file || null];
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

          const fileName = file.name.toLowerCase();
          const validExtensions = ['jpg', 'jpeg', 'png'];
          const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

          if (validExtensions.includes(fileExtension)) {
            Swal.resetValidationMessage(); // 올바른 파일 형식 선택 시 경고 메시지 제거
          }
        } else {
          fileNameDisplay.textContent = '선택된 파일 없음';
          imgPreview.src = defaultImageUrl;
          imgPreview.style.display = 'inline-block';
          Swal.resetValidationMessage(); // 파일 선택이 취소되면 경고 메시지 제거
        }
      });
    },
  });

  if (formValues) {
    const CreateTeam = async () => {
      const formData = new FormData();
      formData.append('teamName', formValues[0]);
      formData.append('songName', formValues[1]);
      if (formValues[2]) {
        formData.append('teamProfile', formValues[2]);
      }
      // formData.forEach((value, key) => {
      //   console.warn(`${key}: ${value}`);
      // });
      const res = await postCreateTeam(formData);
      console.log(res);
      if (res.success) {
        Swal.fire({
          title: `${formValues[0]} 팀이 생성되었습니다!`,
          icon: 'success',
          confirmButtonText: '확인',
          willClose: () => {
            location.reload();
          },
        });
      } else {
        Swal.fire({
          title: '팀 생성에 실패했습니다.',
          text: res.error.errorMessage,
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    };
    CreateTeam();
  }
}
