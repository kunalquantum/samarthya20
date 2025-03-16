import streamlit as st
import numpy as np
from PIL import Image, ImageDraw
import os

# Create a directory to save images if it doesn't exist
if not os.path.exists("drawings"):
    os.makedirs("drawings")

# Function to draw basic shapes
def draw_shape(draw_tool, shape, x, y, width, height, color):
    if shape == "Circle":
        draw_tool.ellipse((x, y, x + width, y + height), outline=color, width=2)
    elif shape == "Square":
        draw_tool.rectangle((x, y, x + width, y + height), outline=color, width=2)
    elif shape == "Rectangle":
        draw_tool.rectangle((x, y, x + width, y + height), outline=color, width=2)
    elif shape == "Triangle":
        points = [(x, y), (x + width, y), (x + width / 2, y - height)]
        draw_tool.polygon(points, outline=color, fill=color)

def main():
    st.set_page_config(layout="centered")  # Center the layout for a cleaner look
    st.title("Simple Drawing App")

    # Layout: Canvas in center with sidebar for controls
    st.sidebar.header("Drawing Settings")
    
    # Drawing configuration in sidebar
    stroke_color = st.sidebar.color_picker("Pick Stroke Color", "#000000", key="stroke_color")
    stroke_width = st.sidebar.slider("Stroke Width", 1, 25, 3, key="stroke_width")
    
    # Create a blank canvas
    width, height = 600, 600  # Updated canvas size to 600x600
    canvas = np.ones((height, width, 3), dtype="uint8") * 255  # White canvas

    # Initialize session state to hold the drawing state
    if "drawing" not in st.session_state:
        st.session_state.drawing = Image.fromarray(canvas)
    if "draw_tool" not in st.session_state:
        st.session_state.draw_tool = ImageDraw.Draw(st.session_state.drawing)

    st.subheader("Draw on the canvas below")

    # Drawing area using Streamlit Canvas
    from streamlit_drawable_canvas import st_canvas

    canvas_result = st_canvas(
        fill_color="rgba(255, 255, 255, 0)",  # Transparent fill
        stroke_width=st.session_state.stroke_width,
        stroke_color=st.session_state.stroke_color,
        background_color="#FFFFFF",
        height=600,  # Updated height to 600
        width=600,   # Updated width to 600
        drawing_mode="freedraw",  # Free drawing like a pencil
        key="canvas",
    )

    # Submit button to save the drawing
    if st.button("Submit Drawing", use_container_width=True):
        if canvas_result.image_data is not None:
            # Convert the result to an image and save
            drawing = Image.fromarray((canvas_result.image_data).astype("uint8"))
            filename = f"drawings/{len(os.listdir('drawings')) + 1}.png"
            drawing.save(filename)
            st.success(f"Drawing saved as {filename}")
        else:
            st.warning("Please draw something before submitting.")

    # Display the canvas with the latest drawing
    st.image(st.session_state.drawing, caption="Your Drawing", use_column_width=True)

if __name__ == "__main__":
    main()
    