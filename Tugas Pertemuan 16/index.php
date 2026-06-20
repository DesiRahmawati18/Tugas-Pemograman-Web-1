<?php
session_start();
if (!isset($_SESSION['login'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIAKAD - Universitas Pamulang</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="#">SIAKAD ACADEMIC</a>
            <div class="d-flex align-items-center">
                <span class="text-white me-3">Halo, <strong><?= htmlspecialchars($_SESSION['username']); ?></strong></span>
                <a href="logout.php" class="btn btn-danger btn-sm" onclick="return confirm('Apakah Anda yakin ingin keluar?')">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container my-5">
        <h2 class="mb-4 text-center fw-bold text-secondary">Sistem Informasi Akademik (SIAKAD)</h2>

        <ul class="nav nav-tabs shadow-sm bg-white rounded mb-4" id="academicTabs" role="tablist">
            <li class="nav-item">
                <button class="nav-link active fw-semibold" id="mahasiswa-tab" data-bs-toggle="tab" data-bs-target="#mahasiswa-pane" type="button" role="tab" onclick="switchModule('mahasiswa')">Data Mahasiswa</button>
            </li>
            <li class="nav-item">
                <button class="nav-link fw-semibold" id="dosen-tab" data-bs-toggle="tab" data-bs-target="#dosen-pane" type="button" role="tab" onclick="switchModule('dosen')">Data Dosen</button>
            </li>
            <li class="nav-item">
                <button class="nav-link fw-semibold" id="matkul-tab" data-bs-toggle="tab" data-bs-target="#matkul-pane" type="button" role="tab" onclick="switchModule('matkul')">Mata Kuliah</button>
            </li>
            <li class="nav-item">
                <button class="nav-link fw-semibold" id="jadwal-tab" data-bs-toggle="tab" data-bs-target="#jadwal-pane" type="button" role="tab" onclick="switchModule('jadwal')">Data Jadwal</button>
            </li>
        </ul>

        <div class="tab-content card p-4 shadow-sm border-0" id="academicTabsContent">
            
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 id="moduleTitle" class="fw-bold text-dark">Daftar Mahasiswa</h4>
                <button class="btn btn-primary shadow-sm" id="btnTambahGlobal" onclick="bukaModalTambah()">Tambah Data</button>
            </div>

            <div class="table-responsive">
                <table class="table table-hover table-striped align-middle">
                    <thead class="table-dark" id="tabelHeader">
                        <!-- Header akan diisi oleh JavaScript -->
                    </thead>
                    <tbody id="tempat-data-global">
                        <!-- Data akan diisi oleh JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="globalModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalTitle">Form Input Data</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="formGlobal" onsubmit="simpanDataGlobal(event)">
                    <div class="modal-body" id="modalFormFields">
                        <!-- Field akan diisi oleh JavaScript -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary" id="btnSimpan">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>