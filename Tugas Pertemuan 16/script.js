// ============================================
// GLOBAL VARIABLES
// ============================================
let currentModule = 'mahasiswa';
let currentEditId = null;
let modalInstance = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    modalInstance = new bootstrap.Modal(document.getElementById('globalModal'));
    switchModule('mahasiswa');
});

// ============================================
// SWITCH MODULE
// ============================================
function switchModule(module) {
    currentModule = module;
    currentEditId = null;
    
    let title = '';
    switch(module) {
        case 'mahasiswa':
            title = 'Daftar Mahasiswa';
            break;
        case 'dosen':
            title = 'Daftar Dosen';
            break;
        case 'matkul':
            title = 'Daftar Mata Kuliah';
            break;
        case 'jadwal':
            title = 'Daftar Jadwal Kuliah';
            break;
    }
    document.getElementById('moduleTitle').innerText = title;
    
    // Update active tab
    document.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${module}-tab`).classList.add('active');
    
    loadData();
}

// ============================================
// LOAD DATA
// ============================================
function loadData() {
    fetch(`api.php?action=list&module=${currentModule}`)
        .then(res => res.json())
        .then(data => {
            renderTable(data);
        })
        .catch(err => console.error('Error:', err));
}

// ============================================
// RENDER TABLE
// ============================================
function renderTable(data) {
    const header = document.getElementById('tabelHeader');
    const body = document.getElementById('tempat-data-global');
    
    let headerHtml = '';
    let bodyHtml = '';
    
    if (data.length === 0) {
        headerHtml = '<tr><th>No</th><th>Data Kosong</th></tr>';
        bodyHtml = `<tr><td colspan="2" class="text-center text-muted py-4">Belum ada data</td></tr>`;
    } else {
        switch(currentModule) {
            case 'mahasiswa':
                headerHtml = `
                    <tr>
                        <th>No</th>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Jurusan</th>
                        <th>Email</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                `;
                data.forEach((item, index) => {
                    bodyHtml += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.nim}</td>
                            <td>${item.nama}</td>
                            <td>${item.jurusan}</td>
                            <td>${item.email}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" onclick="editData(${item.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteData(${item.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                });
                break;
                
            case 'dosen':
                headerHtml = `
                    <tr>
                        <th>No</th>
                        <th>Nama Dosen</th>
                        <th>Alamat</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                `;
                data.forEach((item, index) => {
                    bodyHtml += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.nama}</td>
                            <td>${item.alamat}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" onclick="editData(${item.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteData(${item.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                });
                break;
                
            case 'matkul':
                headerHtml = `
                    <tr>
                        <th>No</th>
                        <th>Mata Kuliah</th>
                        <th>SKS</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                `;
                data.forEach((item, index) => {
                    bodyHtml += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.matkul}</td>
                            <td>${item.sk}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" onclick="editData(${item.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteData(${item.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                });
                break;
                
            case 'jadwal':
                headerHtml = `
                    <tr>
                        <th>No</th>
                        <th>Dosen</th>
                        <th>Mata Kuliah</th>
                        <th>Waktu</th>
                        <th>Ruang</th>
                        <th class="text-center">Aksi</th>
                    </tr>
                `;
                data.forEach((item, index) => {
                    bodyHtml += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.nama_dosen || '-'}</td>
                            <td>${item.nama_matkul || '-'}</td>
                            <td>${item.waktu}</td>
                            <td>${item.ruang}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-1" onclick="editData(${item.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteData(${item.id})">Hapus</button>
                            </td>
                        </tr>
                    `;
                });
                break;
        }
    }
    
    header.innerHTML = headerHtml;
    body.innerHTML = bodyHtml;
}

// ============================================
// OPEN MODAL FOR ADD
// ============================================
function bukaModalTambah() {
    currentEditId = null;
    document.getElementById('modalTitle').innerText = `Tambah Data ${getModuleLabel()}`;
    document.getElementById('formGlobal').reset();
    generateFormFields(null);
    modalInstance.show();
}

// ============================================
// EDIT DATA
// ============================================
function editData(id) {
    currentEditId = id;
    document.getElementById('modalTitle').innerText = `Edit Data ${getModuleLabel()}`;
    
    fetch(`api.php?action=get_single&module=${currentModule}&id=${id}`)
        .then(res => res.json())
        .then(data => {
            generateFormFields(data);
            modalInstance.show();
        })
        .catch(err => console.error('Error:', err));
}

// ============================================
// GENERATE FORM FIELDS
// ============================================
function generateFormFields(data) {
    const container = document.getElementById('modalFormFields');
    let html = '';
    
    // Hidden ID
    html += `<input type="hidden" id="edit_id" value="${data ? data.id : ''}">`;
    html += `<input type="hidden" name="module" value="${currentModule}">`;
    
    switch(currentModule) {
        case 'mahasiswa':
            html += `
                <div class="mb-3">
                    <label class="form-label">NIM</label>
                    <input type="text" class="form-control" name="nim" value="${data ? data.nim : ''}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nama</label>
                    <input type="text" class="form-control" name="nama" value="${data ? data.nama : ''}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Jurusan</label>
                    <input type="text" class="form-control" name="jurusan" value="${data ? data.jurusan : ''}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" name="email" value="${data ? data.email : ''}" required>
                </div>
            `;
            break;
            
        case 'dosen':
            html += `
                <div class="mb-3">
                    <label class="form-label">Nama Dosen</label>
                    <input type="text" class="form-control" name="nama" value="${data ? data.nama : ''}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Alamat</label>
                    <textarea class="form-control" name="alamat" rows="3" required>${data ? data.alamat : ''}</textarea>
                </div>
            `;
            break;
            
        case 'matkul':
            html += `
                <div class="mb-3">
                    <label class="form-label">Mata Kuliah</label>
                    <input type="text" class="form-control" name="matkul" value="${data ? data.matkul : ''}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">SKS</label>
                    <input type="number" class="form-control" name="sk" value="${data ? data.sk : ''}" required min="1" max="6">
                </div>
            `;
            break;
            
        case 'jadwal':
            // Get dosen and matkul data for dropdowns
            fetch('api.php?action=get_dosen_matkul')
                .then(res => res.json())
                .then(options => {
                    let jadwalHtml = `
                        <div class="mb-3">
                            <label class="form-label">Dosen</label>
                            <select class="form-control" name="id_dosen" required>
                                <option value="">Pilih Dosen</option>
                    `;
                    options.dosen.forEach(d => {
                        const selected = (data && data.id_dosen == d.id) ? 'selected' : '';
                        jadwalHtml += `<option value="${d.id}" ${selected}>${d.nama}</option>`;
                    });
                    jadwalHtml += `
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Mata Kuliah</label>
                            <select class="form-control" name="id_matkul" required>
                                <option value="">Pilih Mata Kuliah</option>
                    `;
                    options.matkul.forEach(m => {
                        const selected = (data && data.id_matkul == m.id) ? 'selected' : '';
                        jadwalHtml += `<option value="${m.id}" ${selected}>${m.matkul}</option>`;
                    });
                    jadwalHtml += `
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Waktu</label>
                            <input type="text" class="form-control" name="waktu" value="${data ? data.waktu : ''}" placeholder="Contoh: Senin 08:00-10:00" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Ruang</label>
                            <input type="text" class="form-control" name="ruang" value="${data ? data.ruang : ''}" placeholder="Contoh: R. 301" required>
                        </div>
                    `;
                    container.innerHTML = jadwalHtml;
                })
                .catch(err => console.error('Error:', err));
            return; // Exit early karena async
    }
    
    container.innerHTML = html;
}

// ============================================
// SAVE DATA
// ============================================
function simpanDataGlobal(event) {
    event.preventDefault();
    
    const form = document.getElementById('formGlobal');
    const formData = new FormData(form);
    const id = document.getElementById('edit_id') ? document.getElementById('edit_id').value : '';
    
    // Add ID if exists
    if (id) {
        formData.append('id', id);
    }
    
    fetch('api.php?action=save', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Data berhasil disimpan!');
            modalInstance.hide();
            loadData();
        } else {
            alert('Error: ' + result.message);
        }
    })
    .catch(err => console.error('Error:', err));
}

// ============================================
// DELETE DATA
// ============================================
function deleteData(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    const formData = new FormData();
    formData.append('id', id);
    formData.append('module', currentModule);
    
    fetch('api.php?action=delete', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(result => {
        if (result.status === 'success') {
            alert('Data berhasil dihapus!');
            loadData();
        } else {
            alert('Error: ' + result.message);
        }
    })
    .catch(err => console.error('Error:', err));
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getModuleLabel() {
    switch(currentModule) {
        case 'mahasiswa': return 'Mahasiswa';
        case 'dosen': return 'Dosen';
        case 'matkul': return 'Mata Kuliah';
        case 'jadwal': return 'Jadwal';
        default: return '';
    }
}

// Load data on page load
loadData();