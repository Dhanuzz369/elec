import { parsePrefill } from "@/lib/quote/prefill";
import { clearDependents, emptyAnswers, isValidEmail, phoneDigits, validateStep, visibleSteps, type Answers } from "@/lib/quote/steps";
import { getStrings } from "@/lib/quote/strings";

const t = getStrings("en");
const a = (over: Partial<Answers>): Answers => ({ ...emptyAnswers(), ...over });
const pre = (q: string) => parsePrefill(new URLSearchParams(q));

describe("contact step", () => {
  test("name and a padded email is enough", () => {
    expect(validateStep("contact", a({ name: "Ali", email: " Ali@X.com " }), t)).toBeNull();
  });
  test("name and a punctuated phone is enough", () => {
    expect(validateStep("contact", a({ name: "Ali", phone: "+971 (50) 123-4567" }), t)).toBeNull();
  });
  test("a short phone and no email points at email", () => {
    expect(validateStep("contact", a({ name: "Ali", phone: "12345" }), t)?.field).toBe("email");
  });
  test("a half-typed email with a good phone points at email", () => {
    expect(validateStep("contact", a({ name: "Ali", email: "ali@", phone: "+971501234567" }), t)?.field).toBe("email");
  });
  test("name is required", () => {
    expect(validateStep("contact", a({ email: "a@b.co" }), t)?.field).toBe("name");
  });
  test("helpers", () => {
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail(" a@b.co ")).toBe(true);
    expect(phoneDigits("+971 (50) 123-4567")).toBe(12);
  });
});

test("Something else needs its text", () => {
  expect(validateStep("product", a({ product: "other" }), t)?.field).toBe("productOther");
  expect(validateStep("product", a({}), t)?.field).toBe("product");
  expect(validateStep("product", a({ product: "transformers" }), t)).toBeNull();
});

test("Another amount needs its text; notes never fail", () => {
  expect(validateStep("quantity", a({ quantity: "other" }), t)?.field).toBe("quantityOther");
  expect(validateStep("notes", emptyAnswers(), t)).toBeNull();
  expect(validateStep("destination", emptyAnswers(), t)?.field).toBe("country");
  expect(validateStep("terms", emptyAnswers(), t)?.field).toBe("terms");
  expect(validateStep("variety", emptyAnswers(), t)?.field).toBe("variety");
});

describe("pre-fill", () => {
  test("variety must be a whole variant slug of that product", () => {
    expect(pre("product=lt-panels&variety=MCC")).toEqual({ product: "lt-panels" });
    expect(pre("product=lt-panels&variety=motor-control-centre-mcc")).toEqual({
      product: "lt-panels",
      variety: "motor-control-centre-mcc",
    });
  });
  test("hostile and out-of-group values are ignored", () => {
    expect(pre("product=lt-panels&variety=<script>")).toEqual({ product: "lt-panels" });
    expect(pre("variety=motor-control-centre-mcc")).toEqual({});
    expect(pre("product=transformers&variety=motor-control-centre-mcc")).toEqual({ product: "transformers" });
    expect(pre("product=" + "a".repeat(200))).toEqual({});
    expect(pre("product=other")).toEqual({});
    expect(pre("product=lt-panels&variety=any")).toEqual({ product: "lt-panels" });
  });
});

test("visible steps", () => {
  expect(visibleSteps(emptyAnswers(), {})).toHaveLength(7);
  const one = visibleSteps(emptyAnswers(), { product: "lt-panels" });
  expect(one).toHaveLength(6);
  expect(one).not.toContain("product");
  expect(visibleSteps(emptyAnswers(), { product: "lt-panels", variety: "motor-control-centre-mcc" })).toHaveLength(5);
  expect(visibleSteps(a({ product: "other" }), {})).not.toContain("variety");
});

test("changing product clears what depended on it", () => {
  const next = clearDependents(a({ product: "other", variety: "x", productOther: "trays" }), "product");
  expect(next.variety).toBe("");
  expect(next.productOther).toBe("trays");
  expect(clearDependents(a({ product: "transformers", productOther: "trays" }), "product").productOther).toBe("");
  expect(clearDependents(a({ quantity: "sample", quantityOther: "40" }), "quantity").quantityOther).toBe("");
});
