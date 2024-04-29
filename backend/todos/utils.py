class TodoChoices:
    P = "p"
    IP = "ip"
    C = "c"

    CHOICES = [
        ("p", "Pending"),
        ("ip", "In Progress"),
        ("c", "Completed"),
    ]


class PriorityChoices:
    L = "l"
    M = "m"
    H = "h"

    CHOICES = [
        ("l", "Low"),
        ("m", "Medium"),
        ("h", "High"),
    ]
