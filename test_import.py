#!/usr/bin/env python
try:
    print("Importing app...")
    import app
    print("SUCCESS: App imported")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
