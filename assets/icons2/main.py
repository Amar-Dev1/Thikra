 
import os
import xml.etree.ElementTree as ET

def clean_svg_file(filepath):
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    tree = ET.parse(filepath)
    root = tree.getroot()

    # Remove fill/stroke from root <svg> tag
    if "fill" in root.attrib:
        del root.attrib["fill"]
    if "stroke" in root.attrib:
        del root.attrib["stroke"]

    # Iterate all elements recursively
    for elem in root.iter():
        # Remove hardcoded fill/stroke
        if "fill" in elem.attrib:
            elem.attrib["fill"] = "currentColor"
        if "stroke" in elem.attrib:
            elem.attrib["stroke"] = "currentColor"

    # Write back
    tree.write(filepath, encoding="utf-8", xml_declaration=True)

def clean_all_svgs(directory="."):
    for filename in os.listdir(directory):
        if filename.lower().endswith(".svg"):
            filepath = os.path.join(directory, filename)
            try:
                clean_svg_file(filepath)
                print(f"✅ Cleaned: {filename}")
            except Exception as e:
                print(f"❌ Failed: {filename} → {e}")

if __name__ == "__main__":
    clean_all_svgs(".")
