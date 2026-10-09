// Configuration file for Notes.
// To add a new note, simply append a new object to this array.
// Fields:
// - id: Unique identifier (string or number).
// - title: Name of the notes.
// - subject: The subject or category under which this note falls.
// - description: Optional short description of the contents.
// - pages: Optional page count (number).
// - tags: Array of topics or keywords.
// - googleDriveUrl: Publicly accessible sharing link to the PDF on Google Drive.

const notesData = [
    {
        id: "4",
        title: "MOS Inverters (Static Characteristics)",
        subject: "Digital Very Large Scale Integration (DVLSI)",
        description: "Introduction to inverters, resistive load inverters, CMOS inverters, BJT, BiCMOS",
        tags: ["VLSI", "CMOS", "BJT"],
        googleDriveUrl: "https://drive.google.com/file/d/1b-C395fM31foF0JUmWemUJbUx3GpqlNK/view?usp=sharing"
    },
    {
        id: "5",
        title: "Fabrication of MOSFETs, Layout Design, Switching Characteristics",
        subject: "Digital Very Large Scale Integration (DVLSI)",
        description: "CMOS fabrication, layout design rules",
        tags: ["VLSI", "CMOS", "FABRICATION", "LAYOUT"],
        googleDriveUrl: "https://drive.google.com/file/d/1JPJGcxmc62cdi3cQ7HxHlokMZZCYRxqM/view?usp=drive_link"
    },
    {
        id: "6",
        title: "Interconnect Effects, Bi-stable elements and Dynamic Logic Circuits",
        subject: "Digital Very Large Scale Integration (DVLSI)",
        description: "Parasitics, delay, power dissipation, latches",
        tags: ["VLSI", "CMOS", "DELAY", "FLIPFLOP"],
        googleDriveUrl: "https://drive.google.com/file/d/19lfEuX2wqhf9XHTby6YbO8HCMwZ49yRV/view?usp=sharing"
    }
];
