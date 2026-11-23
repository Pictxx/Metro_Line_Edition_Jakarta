document.addEventListener('DOMContentLoaded',()=>{
  const err=document.getElementById('formError');
  const fail=m=>{err.textContent=m;err.classList.remove('hidden')};
  if(Store.user())location.href='index.html';
  const lf=document.getElementById('loginForm'),rf=document.getElementById('registerForm');
  if(lf)lf.addEventListener('submit',e=>{
    e.preventDefault();
    const u=lf.username.value.trim(),p=lf.password.value;
    if(!u||!p)return fail('Isi username dan kata sandi.');
    const r=Store.login(u,p);r.ok?location.href='index.html':fail(r.msg);
  });
  if(rf)rf.addEventListener('submit',e=>{
    e.preventDefault();
    const u=rf.username.value.trim(),p=rf.password.value,c=rf.confirm.value;
    if(!/^[A-Za-z0-9_]{3,16}$/.test(u))return fail('Username 3–16 karakter: huruf, angka, atau _.');
    if(p.length<6)return fail('Kata sandi minimal 6 karakter.');
    if(p!==c)return fail('Konfirmasi kata sandi tidak cocok.');
    const r=Store.register(u,p);
    if(!r.ok)return fail(r.msg);
    Store.login(u,p);location.href='index.html';
  });
});
