#!/bin/bash
TARGET_DIR="/home/pisitpong/group3-standalone/source/public/assets/group3/shared/characters"
BRAIN_DIR="/home/pisitpong/.gemini/antigravity-cli/brain/6d4396da-c196-42cb-9053-113a8ce580ae"

declare -A files=(
    ["seller_idle_1787200923022.jpg"]="hero-seller-idle-v1.webp"
    ["seller_talk_1787200937679.jpg"]="hero-seller-gesture-v2.webp"
    ["david_idle_1787200949319.jpg"]="hero-student-male-idle-v1.webp"
    ["david_talk_1787200960726.jpg"]="hero-student-male-talk-v2.webp"
    ["liming_idle_1787201031050.jpg"]="hero-liming-idle-v1.webp"
    ["liming_talk_1787201043584.jpg"]="hero-liming-talk-v1.webp"
    ["mary_idle_1787201055809.jpg"]="hero-student-female-idle-v1.webp"
    ["mary_talk_1787201072650.jpg"]="hero-student-female-talk-v2.webp"
    ["waiter_idle_1787201089848.jpg"]="hero-waiter-idle-v1.webp"
    ["waiter_talk_1787201099422.jpg"]="hero-waiter-talk-v1.webp"
    ["liuming_idle_1787201110498.jpg"]="hero-liuming-idle-v1.webp"
    ["liuming_talk_1787201123995.jpg"]="hero-liuming-talk-v1.webp"
)

for src in "${!files[@]}"; do
    dest="${files[$src]}"
    if [ -f "$BRAIN_DIR/$src" ]; then
        echo "Processing $src -> $dest"
        # Convert to webp and make white transparent
        magick "$BRAIN_DIR/$src" -fuzz 5% -transparent white "$TARGET_DIR/$dest"
    else
        echo "File $src not found!"
    fi
done

echo "Done!"
