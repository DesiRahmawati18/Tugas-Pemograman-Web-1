function hitungNilai() {

    // Mengambil input
    let nama = document.getElementById("nama").value;
    let tugas = parseFloat(document.getElementById("tugas").value);
    let uts = parseFloat(document.getElementById("uts").value);
    let uas = parseFloat(document.getElementById("uas").value);

    // Operator aritmatika
    let rataRata = (tugas + uts + uas) / 3;

    let grade;
    let keterangan;

    // Operator perkondisian
    if (rataRata >= 85) {
        grade = "A";
        keterangan = "Lulus Dengan Sangat Baik";
    }
    else if (rataRata >= 70) {
        grade = "B";
        keterangan = "Lulus";
    }
    else if (rataRata >= 60) {
        grade = "C";
        keterangan = "Cukup";
    }
    else {
        grade = "D";
        keterangan = "Tidak Lulus";
    }

    // Menampilkan hasil
    document.getElementById("hasil").innerHTML =
        "Nama : " + nama + "<br>" +
        "Rata-rata : " + rataRata.toFixed(2) + "<br>" +
        "Grade : " + grade + "<br>" +
        "Keterangan : " + keterangan;
}