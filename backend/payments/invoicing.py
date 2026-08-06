from io import BytesIO

import cloudinary.uploader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet


def generate_invoice_pdf(order):
    """
    Build a simple, clean PDF invoice for a captured order and upload
    it to Cloudinary. Returns the invoice's public URL.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        topMargin=20 * mm, bottomMargin=20 * mm,
        leftMargin=20 * mm, rightMargin=20 * mm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "InvoiceTitle", parent=styles["Heading1"], fontSize=20, textColor=colors.HexColor("#C9A24B")
    )
    small = ParagraphStyle("Small", parent=styles["Normal"], fontSize=9, textColor=colors.grey)

    elements = [
        Paragraph("NEELA JEWELLERY", title_style),
        Paragraph("Tax Invoice", styles["Heading3"]),
        Spacer(1, 4 * mm),
        Paragraph(f"Invoice for Order: <b>{order.order_number}</b>", styles["Normal"]),
        Paragraph(f"Order date: {order.placed_at.strftime('%d %b %Y, %I:%M %p')}", small),
        Spacer(1, 6 * mm),
    ]

    address = order.shipping_address
    elements.append(Paragraph("<b>Shipping Address</b>", styles["Normal"]))
    elements.append(
        Paragraph(
            f"{address.full_name}<br/>{address.address_line1}"
            f"{', ' + address.address_line2 if address.address_line2 else ''}<br/>"
            f"{address.city}, {address.state} {address.postal_code}<br/>"
            f"{address.country} — {address.phone_number}",
            small,
        )
    )
    elements.append(Spacer(1, 6 * mm))

    table_data = [["Item", "Qty", "Price", "Subtotal"]]
    for item in order.items.all():
        table_data.append(
            [item.product_name, str(item.quantity), f"₹{item.price}", f"₹{item.subtotal}"]
        )

    items_table = Table(table_data, colWidths=[80 * mm, 20 * mm, 35 * mm, 35 * mm])
    items_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1A1A1A")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E4CD8F")),
                ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    elements.append(items_table)
    elements.append(Spacer(1, 6 * mm))

    totals_data = [
        ["Subtotal", f"₹{order.subtotal}"],
        ["Discount", f"-₹{order.discount_amount}"],
        ["Shipping", f"₹{order.shipping_charge}"],
        ["Tax (GST)", f"₹{order.tax_amount}"],
        ["Total Paid", f"₹{order.total_amount}"],
    ]
    totals_table = Table(totals_data, colWidths=[135 * mm, 35 * mm])
    totals_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
                ("LINEABOVE", (0, -1), (-1, -1), 1, colors.HexColor("#1A1A1A")),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    elements.append(totals_table)
    elements.append(Spacer(1, 10 * mm))
    elements.append(Paragraph("Thank you for shopping with Neela Jewellery.", small))

    doc.build(elements)
    buffer.seek(0)

    upload_result = cloudinary.uploader.upload(
        buffer,
        resource_type="raw",
        folder="invoices",
        public_id=f"invoice-{order.order_number}",
        overwrite=True,
        format="pdf",
    )
    return upload_result.get("secure_url")
