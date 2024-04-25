import {validator} from "./validator.js";
import {withdrawal} from "./memberWithdrawal.js";

// let globalAddressData = {};

const member = {
    init: function () {
        const _this = this;
        document.getElementById("btn-signup")?.addEventListener("click", function () {
            _this.signup();
        });

        document.getElementById("btn-change-nickname")?.addEventListener("click", function () {
            _this.changeNickname();
        });
        document.getElementById("btn-update-address")?.addEventListener("click", function () {
            _this.changeAddress();
        });
        _this.changePassword();
    },

    signup: function () {
        const data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            confirmPassword: document.getElementById("confirmPassword").value,
            nickname: document.getElementById("nickname").value,
            email: document.getElementById("email").value,
            mobile: document.getElementById("mobile").value,
            // zipcode: globalAddressData.zipcode || '', // 우편번호
            // streetAddress: globalAddressData.streetAddress || '', // 도로명 주소
            // detailAddress: document.getElementById("detailAddress").value, // 상세주소
            role: document.querySelector("input[name='role']:checked")?.value || "BUYER"
        }

        fetch("/api/v1/member/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                alert("회원가입이 완료되었습니다.")
                location.href = "/member/login";
            } else {
                throw new Error("회원가입 처리 중 문제가 발생했습니다.")
            }
        }).catch(error => {
            alert("알 수 없는 오류가 발생했습니다.");
            console.log(error);
        })
    },
    changeNickname: function () {
        const nicknameSpan = document.querySelector("#nickname-span");
        console.log(nicknameSpan)
        const currentNickname = nicknameSpan.textContent
        console.log(currentNickname)
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentNickname;
        input.id = 'nickname-input';
        input.className = 'form-control'

        nicknameSpan.replaceWith(input);

        input.focus();
        console.log(input)

        input.addEventListener('blur', function () {
            const newNickname = input.value;

            fetch('/api/v1/member/updateNickname', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `nickname=${encodeURIComponent(newNickname)}`
            })
            .then(response => {
                if(!response.ok) {
                    throw new Error("네트워크 오류입니다.");
                }
                return response.text();
            })
            .then(() => {
                const span = document.createElement('span');
                span.textContent = newNickname;
                span.id = 'nickname-span';
                input.replaceWith(span);
            }).catch(error => {
                console.error('Nickname update failed:', error);
            });
        });
    },
    changeAddress: function () {
        const data = {
            zipcode: document.getElementById("zipcode").value,
            streetAddress: document.getElementById("streetAddress").value,
            detailAddress: document.getElementById("detailAddress").value,
        }

        fetch("/api/v1/member/updateAddress", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error("주소 업데이트에 실패했습니다.");
        })
        .then(data => {
            alert("주소가 성공적으로 업데이트 되었습니다.");
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
    },
    changePassword: function () {
        const btnUpdatePassword = document.getElementById("btn-update-password");
        const modal = document.getElementById('passwordModal');
        const currentPassError = document.getElementById("modal-currentPassword-error");
        const confirmPassError = document.getElementById("modal-confirmPass-error");

        btnUpdatePassword.addEventListener("click", function () {
            modal.style.display = 'block';
            currentPassError.style.display = 'none'; // 모달을 열 때 오류 메시지를 숨깁니다.
            confirmPassError.style.display = 'none';
            bindModalEventListeners();
        });

        function bindModalEventListeners() {
            const btnClose = document.querySelectorAll('.close');
            const btnCancel = document.getElementById('cancel-password-modal');
            const btnConfirm = document.getElementById('save-password-modal')

            btnClose.forEach(function (element) {
                element.addEventListener('click', function () {
                    modal.style.display = 'none';
                })
            });

            btnCancel.addEventListener('click', function () {
                modal.style.display = 'none';
            });

            btnConfirm.addEventListener('click', function () {
                const usernameElement = document.querySelector(".username");
                const currentPasswordElement = document.getElementById("modal-current-pass");
                const newPasswordElement = document.getElementById("newPassword");
                const confirmPasswordElement = document.getElementById("modal-confirm-pass");

                // 입력된 데이터 검증
                if (newPasswordElement.value !== confirmPasswordElement.value) {
                    confirmPassError.textContent = "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
                    confirmPassError.style.display = 'block';
                    return;
                }

                if (currentPasswordElement.value === newPasswordElement.value) {
                    currentPassError.textContent = "새 비밀번호는 기존 비밀번호와 달라야 합니다.";
                    currentPassError.style.display = 'block';
                    return;
                }

                // 데이터 객체 생성
                const data = {
                    username: usernameElement.value,
                    currentPassword: currentPasswordElement.value,
                    newPassword: newPasswordElement.value,
                    confirmPassword: confirmPasswordElement.value
                };
                console.log(data);

                // 서버로 데이터 전송
                fetch("/api/v1/member/updatePassword", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (!response.ok) {
                            // 서버가 오류 메시지를 JSON으로 반환했다고 가정
                            return response.json().then(errorData => Promise.reject(errorData));
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert("비밀번호가 성공적으로 업데이트 되었습니다.");
                        window.location.href = "/member/info";
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        currentPassError.textContent = error.message || "비밀번호 수정 과정에서 문제가 발생했습니다.";
                        currentPassError.style.display = 'block';
                    });
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    member.init();
    validator.init();
    withdrawal.init();
})