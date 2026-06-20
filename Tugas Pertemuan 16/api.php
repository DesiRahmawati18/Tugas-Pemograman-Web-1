<?php
session_start();
include 'koneksi.php';
header('Content-Type: application/json');

if (!isset($_SESSION['login'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$action = $_GET['action'] ?? '';
$module = $_GET['module'] ?? 'mahasiswa';

// ============================================
// READ LIST
// ============================================
if ($action == 'list') {
    if ($module == 'mahasiswa') {
        $query = mysqli_query($conn, "SELECT * FROM mahasiswa ORDER BY id DESC");
    } elseif ($module == 'dosen') {
        $query = mysqli_query($conn, "SELECT * FROM dosen ORDER BY id DESC");
    } elseif ($module == 'matkul') {
        $query = mysqli_query($conn, "SELECT * FROM matkul ORDER BY id DESC");
    } elseif ($module == 'jadwal') {
        $query = mysqli_query($conn, "
            SELECT j.*, d.nama as nama_dosen, m.matkul as nama_matkul 
            FROM jadwal j
            LEFT JOIN dosen d ON j.id_dosen = d.id
            LEFT JOIN matkul m ON j.id_matkul = m.id
            ORDER BY j.id DESC
        ");
    } else {
        echo json_encode([]);
        exit;
    }

    $data = [];
    while ($row = mysqli_fetch_assoc($query)) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

// ============================================
// GET SINGLE
// ============================================
if ($action == 'get_single') {
    $id = intval($_GET['id']);
    $table = $_GET['module'] ?? 'mahasiswa';
    $query = mysqli_query($conn, "SELECT * FROM $table WHERE id = $id");
    $data = mysqli_fetch_assoc($query);
    echo json_encode($data);
    exit;
}

// ============================================
// GET DOSEN & MATKUL FOR JADWAL DROPDOWN
// ============================================
if ($action == 'get_dosen_matkul') {
    $dosen = [];
    $matkul = [];
    
    $q1 = mysqli_query($conn, "SELECT id, nama FROM dosen ORDER BY nama");
    while ($row = mysqli_fetch_assoc($q1)) {
        $dosen[] = $row;
    }
    
    $q2 = mysqli_query($conn, "SELECT id, matkul FROM matkul ORDER BY matkul");
    while ($row = mysqli_fetch_assoc($q2)) {
        $matkul[] = $row;
    }
    
    echo json_encode(['dosen' => $dosen, 'matkul' => $matkul]);
    exit;
}

// ============================================
// SAVE (CREATE & UPDATE)
// ============================================
if ($action == 'save') {
    $module = $_POST['module'] ?? 'mahasiswa';
    $id = $_POST['id'] ?? '';
    
    if ($module == 'mahasiswa') {
        $nim = mysqli_real_escape_string($conn, $_POST['nim']);
        $nama = mysqli_real_escape_string($conn, $_POST['nama']);
        $jurusan = mysqli_real_escape_string($conn, $_POST['jurusan']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        
        if (empty($id)) {
            $sql = "INSERT INTO mahasiswa (nim, nama, jurusan, email) VALUES ('$nim', '$nama', '$jurusan', '$email')";
        } else {
            $sql = "UPDATE mahasiswa SET nim='$nim', nama='$nama', jurusan='$jurusan', email='$email' WHERE id=$id";
        }
    } elseif ($module == 'dosen') {
        $nama = mysqli_real_escape_string($conn, $_POST['nama']);
        $alamat = mysqli_real_escape_string($conn, $_POST['alamat']);
        
        if (empty($id)) {
            $sql = "INSERT INTO dosen (nama, alamat) VALUES ('$nama', '$alamat')";
        } else {
            $sql = "UPDATE dosen SET nama='$nama', alamat='$alamat' WHERE id=$id";
        }
    } elseif ($module == 'matkul') {
        $matkul = mysqli_real_escape_string($conn, $_POST['matkul']);
        $sk = intval($_POST['sk']);
        
        if (empty($id)) {
            $sql = "INSERT INTO matkul (matkul, sk) VALUES ('$matkul', $sk)";
        } else {
            $sql = "UPDATE matkul SET matkul='$matkul', sk=$sk WHERE id=$id";
        }
    } elseif ($module == 'jadwal') {
        $id_dosen = intval($_POST['id_dosen']);
        $id_matkul = intval($_POST['id_matkul']);
        $waktu = mysqli_real_escape_string($conn, $_POST['waktu']);
        $ruang = mysqli_real_escape_string($conn, $_POST['ruang']);
        
        if (empty($id)) {
            $sql = "INSERT INTO jadwal (id_dosen, id_matkul, waktu, ruang) VALUES ($id_dosen, $id_matkul, '$waktu', '$ruang')";
        } else {
            $sql = "UPDATE jadwal SET id_dosen=$id_dosen, id_matkul=$id_matkul, waktu='$waktu', ruang='$ruang' WHERE id=$id";
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Module tidak dikenal']);
        exit;
    }
    
    if (mysqli_query($conn, $sql)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
    exit;
}

// ============================================
// DELETE
// ============================================
if ($action == 'delete') {
    $id = intval($_POST['id']);
    $table = $_POST['module'] ?? 'mahasiswa';
    
    $sql = "DELETE FROM $table WHERE id = $id";
    if (mysqli_query($conn, $sql)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
    exit;
}
?>