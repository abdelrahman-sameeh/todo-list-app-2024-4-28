class TodoChoices:
    pending = "P"
    in_progress = "IP"
    complete = "C"

    CHOICES = [
        ("P", "Pending"),
        ("IP", "In Progress"),
        ("C", "Completed"),
    ]


class PriorityChoices:
    low = "L"
    medium = "M"
    high = "H"

    CHOICES = [
        ("L", "Low"),
        ("M", "Medium"),
        ("H", "High"),
    ]
