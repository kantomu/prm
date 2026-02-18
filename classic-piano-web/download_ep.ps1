$baseUrl = "https://raw.githubusercontent.com/sfzinstruments/jlearman.jRhodes3c/master/jRhodes3c-looped-flac-sfz/"
$outputDir = "public/samples/ep/"
$samples = @(
    "As_029__F1_1109-stereo.flac",
    "As_035__B1_1111-stereo.flac",
    "As_040__E2_1113-stereo.flac",
    "As_045__A2_1115-stereo.flac",
    "As_050__D3_1117-stereo.flac",
    "As_055__G3_1119-stereo.flac",
    "As_059__B3_1121-stereo.flac",
    "As_062__D4_1123-stereo.flac",
    "As_065__F4_1125-stereo.flac",
    "As_071__B4_1127-stereo.flac",
    "As_076__E5_1129-stereo.flac",
    "As_081__A5_2101-stereo.flac",
    "As_086__D6_2103-stereo.flac",
    "As_091__G6_2105-stereo.flac",
    "As_096__C7_2107-stereo.flac"
)

foreach ($file in $samples) {
    echo "Downloading $file..."
    Invoke-WebRequest -Uri "$baseUrl$file" -OutFile "$outputDir$file"
}
