'use client';

import Swal from 'sweetalert2';
import { patchTeamInfo } from '@/services/team';

export default async function TeamModify(
  teamId = '',
  teamName = '',
  teamSong = '',
  teamImage = '',
  practiceCompleted = false,
) {
  const { value: formValues } = await Swal.fire({
    title: '팀 정보 수정하기',
    html: `
    <style>
      .swal2-input, .swal2-checkbox {
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
        display: ${teamImage ? 'inline-block' : 'none'};
      }
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
        margin-top: 30px;
      }
      .toggle-switch input { 
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      input:checked + .slider {
        background-color: #4CAF50;
      }
      input:checked + .slider:before {
        transform: translateX(26px);
      }
      .practice-status-label {
        font-weight: bold;
      }
    </style>
    <input id="swal-input1" class="swal2-input" type="text" placeholder="팀 이름 (최대 30자)" maxlength="30" value="${teamName}" required>
    <input id="swal-input2" class="swal2-input" type="text" placeholder="곡명 (최대 40자)" maxlength="40" value="${teamSong}">
    <input id="swal-input3" class="file-input" type="file" accept="image/*">
    <label for="swal-input3" class="file-input-label">프로필 사진 변경</label>
    <img id="image-preview" class="image-preview" src="${teamImage}" alt="이미지 미리보기">
    <p id="file-name" class="file-name">${teamImage ? teamImage.split('/').pop() : '선택된 파일 없음'}</p>
    <div style="font-size: 12px; color: #555; margin-top: 8px;">프로필 이미지는 JPG 또는 PNG 파일만 등록 가능합니다.</div>
    <label class="toggle-switch">
      <input type="checkbox" ${practiceCompleted ? 'checked' : ''}>
      <span class="slider"></span>
    </label> <span class="practice-status-label">연습 완료</span>
  `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: '수정하기',
    cancelButtonText: '취소하기',
    preConfirm: () => {
      const input1 = document.getElementById('swal-input1') as HTMLInputElement;
      const input2 = document.getElementById('swal-input2') as HTMLInputElement;
      const practiceCompleted = document.querySelector(
        '.toggle-switch input',
      ) as HTMLInputElement;
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

      return {
        teamName: input1.value,
        teamSong: input2.value,
        isFinished: practiceCompleted.checked,
        teamProfile: file || null,
      };
    },
    didOpen: () => {
      const inputElement = document.getElementById(
        'swal-input3',
      ) as HTMLInputElement;
      const fileNameDisplay = document.getElementById(
        'file-name',
      ) as HTMLSpanElement;
      const imgPreview = document.getElementById(
        'image-preview',
      ) as HTMLImageElement;

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
          imgPreview.style.display = 'none';
        }
      });
    },
  });

  if (formValues) {
    const { teamName, teamSong, isFinished, teamProfile } = formValues;
    const response = await patchTeamInfo(
      teamId,
      teamName,
      teamSong,
      isFinished,
      teamProfile,
    );
    if (!response.success) {
      Swal.fire({
        title: '팀 정보 수정 실패',
        text: response.error.errorMessage,
        icon: 'error',
        confirmButtonText: '확인',
      });
      return;
    } else {
      Swal.fire({
        title: `팀 정보가 수정되었습니다!`,
        icon: 'success',
        confirmButtonText: '확인',
        willClose: () => {
          location.reload();
        }
      });
    }
  }
}
